package com.example.inventory_system.auth.dto;

import java.util.Set;

public class LoginResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private Long shopId;
    private String shopName;
    private Boolean platformAdmin;
    private Set<String> roles;
    private Boolean passwordChanged;
    private String shopRequestStatus;

    public LoginResponse() {
    }

    public LoginResponse(String accessToken,
                         Long userId,
                         String username,
                         Long shopId,
                         String shopName,
                         Boolean platformAdmin,
                         Set<String> roles,
                         Boolean passwordChanged,
                         String shopRequestStatus) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.shopId = shopId;
        this.shopName = shopName;
        this.platformAdmin = platformAdmin;
        this.roles = roles;
        this.passwordChanged = passwordChanged;
        this.shopRequestStatus = shopRequestStatus;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public Long getShopId() {
        return shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public Boolean getPlatformAdmin() {
        return platformAdmin;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public Boolean getPasswordChanged() {
        return passwordChanged;
    }

    public String getShopRequestStatus() {
        return shopRequestStatus;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public void setPlatformAdmin(Boolean platformAdmin) {
        this.platformAdmin = platformAdmin;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public void setPasswordChanged(Boolean passwordChanged) {
        this.passwordChanged = passwordChanged;
    }

    public void setShopRequestStatus(String shopRequestStatus) {
        this.shopRequestStatus = shopRequestStatus;
    }
}