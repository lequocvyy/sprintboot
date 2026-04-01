package com.example.inventory_system.shoprequest.service;

import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.DuplicateResourceException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.role.entity.RoleName;
import com.example.inventory_system.role.repository.RoleRepository;
import com.example.inventory_system.security.service.CustomUserDetails;
import com.example.inventory_system.shop.entity.Shop;
import com.example.inventory_system.shop.repository.ShopRepository;
import com.example.inventory_system.shoprequest.dto.CreateShopRequestDto;
import com.example.inventory_system.shoprequest.dto.ShopRequestResponse;
import com.example.inventory_system.shoprequest.entity.ShopRequest;
import com.example.inventory_system.shoprequest.entity.ShopRequestStatus;
import com.example.inventory_system.shoprequest.repository.ShopRequestRepository;
import com.example.inventory_system.user.entity.User;
import com.example.inventory_system.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ShopRequestServiceImpl implements ShopRequestService {

    private final ShopRequestRepository shopRequestRepository;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final RoleRepository roleRepository;

    public ShopRequestServiceImpl(ShopRequestRepository shopRequestRepository,
                                  UserRepository userRepository,
                                  ShopRepository shopRepository,
                                  RoleRepository roleRepository) {
        this.shopRequestRepository = shopRequestRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public ShopRequestResponse createRequest(CreateShopRequestDto dto) {
        User user = getCurrentUser();

        if (!Boolean.TRUE.equals(user.getSubscriptionActive())) {
            throw new BusinessException("User has not purchased a package");
        }

        if (user.getSubscriptionEndAt() == null || user.getSubscriptionEndAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Subscription has expired");
        }

        if (user.getShop() != null) {
            throw new BusinessException("User already has a shop");
        }

        if (shopRepository.existsBySlug(dto.getShopSlug())) {
            throw new DuplicateResourceException("Shop slug already exists");
        }

        if (shopRequestRepository.existsByRequestedByIdAndStatus(user.getId(), ShopRequestStatus.PENDING)) {
            throw new BusinessException("You already have a pending request");
        }

        ShopRequest request = new ShopRequest();
        request.setShopName(dto.getShopName());
        request.setShopSlug(dto.getShopSlug());
        request.setAddress(dto.getAddress());
        request.setStatus(ShopRequestStatus.PENDING);
        request.setRequestedBy(user);

        ShopRequest saved = shopRequestRepository.save(request);
        return toResponse(saved);
    }

    @Override
    public List<ShopRequestResponse> getPendingRequests() {
        return shopRequestRepository.findByStatus(ShopRequestStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ShopRequestResponse approveRequest(Long requestId) {
        ShopRequest request = shopRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop request not found"));

        if (request.getStatus() != ShopRequestStatus.PENDING) {
            throw new BusinessException("Only pending requests can be approved");
        }

        if (shopRepository.existsBySlug(request.getShopSlug())) {
            throw new DuplicateResourceException("Shop slug already exists");
        }

        User requestedUser = request.getRequestedBy();

        if (requestedUser.getShop() != null) {
            throw new BusinessException("User already belongs to a shop");
        }

        Shop shop = new Shop();
        shop.setCode(generateShopCode());
        shop.setName(request.getShopName());
        shop.setSlug(request.getShopSlug());
        shop.setAddress(request.getAddress());
        shop.setActive(true);

        Shop savedShop = shopRepository.save(shop);

        Role shopOwnerRole = roleRepository.findByName(RoleName.SHOP_OWNER)
                .orElseThrow(() -> new ResourceNotFoundException("SHOP_OWNER role not found"));

        requestedUser.setShop(savedShop);

        Set<Role> roles = new HashSet<>(requestedUser.getRoles());
        roles.add(shopOwnerRole);
        requestedUser.setRoles(roles);
        userRepository.save(requestedUser);

        User admin = getCurrentUser();

        request.setStatus(ShopRequestStatus.APPROVED);
        request.setApprovedBy(admin);
        request.setApprovedAt(LocalDateTime.now());

        ShopRequest savedRequest = shopRequestRepository.save(request);
        return toResponse(savedRequest);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new BusinessException("Unauthenticated user");
        }

        return userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private ShopRequestResponse toResponse(ShopRequest request) {
        return new ShopRequestResponse(
                request.getId(),
                request.getShopName(),
                request.getShopSlug(),
                request.getAddress(),
                request.getStatus(),
                request.getRequestedBy().getId(),
                request.getRequestedBy().getUsername(),
                request.getApprovedAt()
        );
    }

    private String generateShopCode() {
        long count = shopRepository.count() + 1;
        return "SHOP" + String.format("%03d", count);
    }
}