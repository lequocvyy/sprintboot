package com.example.inventory_system.security.service;

import com.example.inventory_system.common.exception.BusinessException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    public CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new BusinessException("Unauthenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new BusinessException("Invalid authentication principal");
        }

        return userDetails;
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }

    public String getCurrentRoleName() {
        if (getCurrentUser().getAuthorities() == null || getCurrentUser().getAuthorities().isEmpty()) {
            return "UNKNOWN";
        }

        return getCurrentUser().getAuthorities().iterator().next().getAuthority();
    }

    public Long getCurrentShopId() {
        return getCurrentUser().getShopId();
    }

    public void requireShop() {
        if (getCurrentShopId() == null) {
            throw new BusinessException("User does not belong to any shop");
        }
    }

    public boolean isPlatformAdmin() {
        return Boolean.TRUE.equals(getCurrentUser().getPlatformAdmin());
    }
}