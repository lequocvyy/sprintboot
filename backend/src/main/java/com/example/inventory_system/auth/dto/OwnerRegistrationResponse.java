package com.example.inventory_system.auth.dto;

import java.time.LocalDateTime;

public class OwnerRegistrationResponse {

    private Long userId;
    private String email;
    private String packageCode;
    private LocalDateTime subscriptionEndAt;
    private String message;

    public OwnerRegistrationResponse() {
    }

    public OwnerRegistrationResponse(Long userId, String email, String packageCode,
                                     LocalDateTime subscriptionEndAt, String message) {
        this.userId = userId;
        this.email = email;
        this.packageCode = packageCode;
        this.subscriptionEndAt = subscriptionEndAt;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public LocalDateTime getSubscriptionEndAt() {
        return subscriptionEndAt;
    }

    public String getMessage() {
        return message;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public void setSubscriptionEndAt(LocalDateTime subscriptionEndAt) {
        this.subscriptionEndAt = subscriptionEndAt;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}