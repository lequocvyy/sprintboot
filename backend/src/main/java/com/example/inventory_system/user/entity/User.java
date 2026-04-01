package com.example.inventory_system.user.entity;

import com.example.inventory_system.role.entity.Role;
import com.example.inventory_system.shop.entity.Shop;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Boolean platformAdmin = false;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(length = 30)
    private String subscriptionPackageCode;

    private LocalDateTime subscriptionStartAt;

    private LocalDateTime subscriptionEndAt;

    @Column(nullable = false)
    private Boolean subscriptionActive = false;

    @Column(nullable = false)
    private Boolean passwordChanged = false;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public Boolean getPlatformAdmin() {
        return platformAdmin;
    }

    public Shop getShop() {
        return shop;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public String getSubscriptionPackageCode() {
        return subscriptionPackageCode;
    }

    public LocalDateTime getSubscriptionStartAt() {
        return subscriptionStartAt;
    }

    public LocalDateTime getSubscriptionEndAt() {
        return subscriptionEndAt;
    }

    public Boolean getSubscriptionActive() {
        return subscriptionActive;
    }

    public Boolean getPasswordChanged() {
        return passwordChanged;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setPlatformAdmin(Boolean platformAdmin) {
        this.platformAdmin = platformAdmin;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public void setSubscriptionPackageCode(String subscriptionPackageCode) {
        this.subscriptionPackageCode = subscriptionPackageCode;
    }

    public void setSubscriptionStartAt(LocalDateTime subscriptionStartAt) {
        this.subscriptionStartAt = subscriptionStartAt;
    }

    public void setSubscriptionEndAt(LocalDateTime subscriptionEndAt) {
        this.subscriptionEndAt = subscriptionEndAt;
    }

    public void setSubscriptionActive(Boolean subscriptionActive) {
        this.subscriptionActive = subscriptionActive;
    }

    public void setPasswordChanged(Boolean passwordChanged) {
        this.passwordChanged = passwordChanged;
    }
}