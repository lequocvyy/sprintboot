package com.example.inventory_system.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WarehouseCreateRequest {

    @NotBlank(message = "Warehouse code must not be blank")
    @Size(max = 50, message = "Warehouse code must be less than 50 characters")
    private String code;

    @NotBlank(message = "Warehouse name must not be blank")
    @Size(max = 100, message = "Warehouse name must be less than 100 characters")
    private String name;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;

    public WarehouseCreateRequest() {
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}