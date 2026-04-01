package com.example.inventory_system.shoprequest.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateShopRequestDto {

    @NotBlank
    private String shopName;

    @NotBlank
    private String shopSlug;

    private String address;

    public String getShopName() {
        return shopName;
    }

    public String getShopSlug() {
        return shopSlug;
    }

    public String getAddress() {
        return address;
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
}