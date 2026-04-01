package com.example.inventory_system.shoprequest.entity;

import com.example.inventory_system.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shop_requests")
public class ShopRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String shopName;

    @Column(nullable = false, unique = true)
    private String shopSlug;

    private String address;

    @Enumerated(EnumType.STRING)
    private ShopRequestStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime approvedAt;

    private String rejectionReason;

    public ShopRequest() {
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

    public User getRequestedBy() {
        return requestedBy;
    }

    public User getApprovedBy() {
        return approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
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

    public void setRequestedBy(User requestedBy) {
        this.requestedBy = requestedBy;
    }

    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}