package com.example.inventory_system.shop.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateShopRequest {

    @NotBlank(message = "Shop code is required")
    private String code;

    @NotBlank(message = "Shop name is required")
    private String name;

    @NotBlank(message = "Shop slug is required")
    private String slug;

    private String address;

    @NotBlank(message = "Owner username is required")
    private String ownerUsername;

    @NotBlank(message = "Owner email is required")
    private String ownerEmail;

    @NotBlank(message = "Owner password is required")
    private String ownerPassword;

    @NotBlank(message = "Owner full name is required")
    private String ownerFullName;

    public CreateShopRequest() {
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getAddress() {
        return address;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getOwnerPassword() {
        return ownerPassword;
    }

    public String getOwnerFullName() {
        return ownerFullName;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public void setOwnerPassword(String ownerPassword) {
        this.ownerPassword = ownerPassword;
    }

    public void setOwnerFullName(String ownerFullName) {
        this.ownerFullName = ownerFullName;
    }
}