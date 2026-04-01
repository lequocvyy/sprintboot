package com.example.inventory_system.auth.dto;

public class SubscriptionPackageResponse {

    private String code;
    private String name;
    private Integer durationDays;
    private Long price;

    public SubscriptionPackageResponse() {
    }

    public SubscriptionPackageResponse(String code, String name, Integer durationDays, Long price) {
        this.code = code;
        this.name = name;
        this.durationDays = durationDays;
        this.price = price;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public Long getPrice() {
        return price;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public void setPrice(Long price) {
        this.price = price;
    }
}