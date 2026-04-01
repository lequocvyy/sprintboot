package com.example.inventory_system.shoprequest.dto;

import com.example.inventory_system.shoprequest.entity.ShopRequestStatus;

import java.time.LocalDateTime;

public class ShopRequestResponse {

    private Long id;
    private String shopName;
    private String shopSlug;
    private String address;
    private ShopRequestStatus status;
    private Long requestedByUserId;
    private String requestedByUsername;
    private LocalDateTime approvedAt;

    public ShopRequestResponse() {
    }

    public ShopRequestResponse(Long id,
                               String shopName,
                               String shopSlug,
                               String address,
                               ShopRequestStatus status,
                               Long requestedByUserId,
                               String requestedByUsername,
                               LocalDateTime approvedAt) {
        this.id = id;
        this.shopName = shopName;
        this.shopSlug = shopSlug;
        this.address = address;
        this.status = status;
        this.requestedByUserId = requestedByUserId;
        this.requestedByUsername = requestedByUsername;
        this.approvedAt = approvedAt;
    }

    public Long getId() {
        return id;
    }

    public String getShopName() {
        return shopName;
    }

    public String getShopSlug() {
        return shopSlug;
    }

    public String getAddress() {
        return address;
    }

    public ShopRequestStatus getStatus() {
        return status;
    }

    public Long getRequestedByUserId() {
        return requestedByUserId;
    }

    public String getRequestedByUsername() {
        return requestedByUsername;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public void setShopSlug(String shopSlug) {
        this.shopSlug = shopSlug;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setStatus(ShopRequestStatus status) {
        this.status = status;
    }

    public void setRequestedByUserId(Long requestedByUserId) {
        this.requestedByUserId = requestedByUserId;
    }

    public void setRequestedByUsername(String requestedByUsername) {
        this.requestedByUsername = requestedByUsername;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}