package com.example.inventory_system.security.service;

import com.example.inventory_system.shop.entity.Shop;
import com.example.inventory_system.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public Long getUserId() {
        return user.getId();
    }

    public Long getShopId() {
        return user.getShop() != null ? user.getShop().getId() : null;
    }

    public String getShopName() {
        return user.getShop() != null ? user.getShop().getName() : null;
    }

    public Boolean getPlatformAdmin() {
        return user.getPlatformAdmin();
    }

    public Boolean getPasswordChanged() {
        return user.getPasswordChanged();
    }

    public Set<String> getRoleNames() {
        return user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(user.getEnabled());
    }

    public User getUser() {
        return user;
    }

    public Shop getShop() {
        return user.getShop();
    }
}