package com.example.inventory_system.user.service;

import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.DuplicateResourceException;
import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import com.example.inventory_system.role.repository.RoleRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.user.dto.CreateStaffRequest;
import com.example.inventory_system.user.dto.StaffResponse;
import com.example.inventory_system.user.entity.User;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityService securityService;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           SecurityService securityService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityService = securityService;
    }

    @Override
    public StaffResponse createStaff(CreateStaffRequest request) {
        validateOwnerPermission();
        securityService.requireShop();

        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new BusinessException("Role is required");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRole().trim().toUpperCase());
        } catch (Exception e) {
            throw new BusinessException("Invalid role");
        }

        if (roleName != RoleName.SHOP_STAFF && roleName != RoleName.SHOP_MANAGER) {
            throw new BusinessException("Only SHOP_STAFF or SHOP_MANAGER role can be assigned");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BusinessException("Role not found: " + roleName));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEnabled(true);
        user.setPlatformAdmin(false);
        user.setShop(securityService.getCurrentUser().getShop());

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return toStaffResponse(savedUser);
    }

    @Override
    public List<StaffResponse> getStaffs() {
        validateOwnerOrManagerPermission();
        securityService.requireShop();

        Long shopId = securityService.getCurrentShopId();

        return userRepository.findByShopIdAndPlatformAdminFalse(shopId)
                .stream()
                .map(this::toStaffResponse)
                .toList();
    }

    @Override
    public StaffResponse updateStaffStatus(Long userId, Boolean enabled) {
        validateOwnerPermission();
        securityService.requireShop();

        if (enabled == null) {
            throw new BusinessException("Enabled status is required");
        }

        Long shopId = securityService.getCurrentShopId();
        Long currentUserId = securityService.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Staff not found"));

        if (user.getShop() == null || !shopId.equals(user.getShop().getId())) {
            throw new BusinessException("Staff does not belong to current shop");
        }

        if (Boolean.TRUE.equals(user.getPlatformAdmin())) {
            throw new BusinessException("Cannot update platform admin status");
        }

        if (currentUserId.equals(user.getId()) && !enabled) {
            throw new BusinessException("You cannot disable your own account");
        }

        boolean isOwner = user.getRoles() != null && user.getRoles()
                .stream()
                .anyMatch(role ->
                        role != null
                                && role.getName() != null
                                && role.getName() == RoleName.SHOP_OWNER
                );

        if (isOwner && !enabled) {
            throw new BusinessException("Cannot disable shop owner account");
        }

        user.setEnabled(enabled);
        User savedUser = userRepository.save(user);

        return toStaffResponse(savedUser);
    }

    private void validateOwnerPermission() {
        Set<String> roleNames = securityService.getCurrentUser().getRoleNames();

        if (!roleNames.contains("SHOP_OWNER")) {
            throw new BusinessException("Only shop owner can manage staff");
        }
    }

    private void validateOwnerOrManagerPermission() {
        Set<String> roleNames = securityService.getCurrentUser().getRoleNames();

        if (!roleNames.contains("SHOP_OWNER") && !roleNames.contains("SHOP_MANAGER")) {
            throw new BusinessException("Only shop owner or shop manager can view staff");
        }
    }

    private StaffResponse toStaffResponse(User user) {
        StaffResponse response = new StaffResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setEnabled(Boolean.TRUE.equals(user.getEnabled()));
        response.setShopId(user.getShop() != null ? user.getShop().getId() : null);
        response.setShopName(user.getShop() != null ? user.getShop().getName() : null);

        Set<String> roles = user.getRoles() == null
                ? Collections.emptySet()
                : user.getRoles()
                        .stream()
                        .filter(role -> role != null && role.getName() != null)
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet());

        response.setRoles(roles);
        return response;
    }
}