package com.example.inventory_system.auth.service;

import com.example.inventory_system.auth.dto.*;
import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.DuplicateResourceException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.common.service.EmailService;
import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import com.example.inventory_system.role.repository.RoleRepository;
import com.example.inventory_system.security.jwt.JwtService;
import com.example.inventory_system.security.service.CustomUserDetails;
import com.example.inventory_system.security.service.CustomUserDetailsService;
import com.example.inventory_system.shoprequest.entity.ShopRequest;
import com.example.inventory_system.shoprequest.entity.ShopRequestStatus;
import com.example.inventory_system.shoprequest.repository.ShopRequestRepository;
import com.example.inventory_system.user.entity.User;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ShopRequestRepository shopRequestRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       CustomUserDetailsService customUserDetailsService,
                       JwtService jwtService,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService,
                       ShopRequestRepository shopRequestRepository) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.shopRequestRepository = shopRequestRepository;
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails =
                (CustomUserDetails) customUserDetailsService.loadUserByUsername(request.getUsername());

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
                token,
                userDetails.getUserId(),
                userDetails.getUsername(),
                userDetails.getShopId(),
                userDetails.getShopName(),
                userDetails.getPlatformAdmin(),
                userDetails.getRoleNames(),
                user.getPasswordChanged(),
                resolveShopRequestStatus(user)
        );
    }

    public List<SubscriptionPackageResponse> getPackages() {
        return List.of(
                new SubscriptionPackageResponse("TRIAL_7D", "Dung thu 7 ngay", 7, 5000L),
                new SubscriptionPackageResponse("MONTH_1", "Dang ky 1 thang", 30, 30000L),
                new SubscriptionPackageResponse("MONTH_18", "Dang ky 18 thang", 540, 300000L)
        );
    }

    public OwnerRegistrationResponse registerOwnerAfterPayment(OwnerRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        if (!isValidPackage(request.getPackageCode())) {
            throw new BusinessException("Invalid package code");
        }

        Role ownerRole = roleRepository.findByName(RoleName.SHOP_OWNER)
                .orElseThrow(() -> new ResourceNotFoundException("SHOP_OWNER role not found"));

        String rawPassword = generateRandomPassword();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endAt = now.plusDays(resolveDurationDays(request.getPackageCode()));

        User user = new User();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setEnabled(true);
        user.setPlatformAdmin(false);
        user.setShop(null);
        user.setRoles(Set.of(ownerRole));
        user.setSubscriptionPackageCode(request.getPackageCode());
        user.setSubscriptionStartAt(now);
        user.setSubscriptionEndAt(endAt);
        user.setSubscriptionActive(true);
        user.setPasswordChanged(false);

        User savedUser = userRepository.save(user);

        try {
            emailService.sendNewAccountEmail(
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    savedUser.getUsername(),
                    rawPassword
            );
        } catch (Exception ex) {
            userRepository.delete(savedUser);
            throw new BusinessException("Tao tai khoan that bai vi khong gui duoc email: " + ex.getMessage());
        }

        return new OwnerRegistrationResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getSubscriptionPackageCode(),
                savedUser.getSubscriptionEndAt(),
                "Thanh toan thanh cong. Tai khoan da duoc tao va gui qua email."
        );
    }

    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new BusinessException("Unauthenticated user");
        }

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChanged(true);
        userRepository.save(user);
    }

    private String resolveShopRequestStatus(User user) {
        if (user.getShop() != null) {
            return "APPROVED";
        }

        List<ShopRequest> requests = shopRequestRepository.findAll()
                .stream()
                .filter(item -> item.getRequestedBy() != null
                        && item.getRequestedBy().getId().equals(user.getId()))
                .toList();

        if (requests.isEmpty()) {
            return "NONE";
        }

        ShopRequest latest = requests.get(requests.size() - 1);
        ShopRequestStatus status = latest.getStatus();

        return status != null ? status.name() : "NONE";
    }

    private boolean isValidPackage(String packageCode) {
        return "TRIAL_7D".equals(packageCode)
                || "MONTH_1".equals(packageCode)
                || "MONTH_18".equals(packageCode);
    }

    private int resolveDurationDays(String packageCode) {
        return switch (packageCode) {
            case "TRIAL_7D" -> 7;
            case "MONTH_1" -> 30;
            case "MONTH_18" -> 540;
            default -> throw new BusinessException("Invalid package code");
        };
    }

    private String generateRandomPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }
}