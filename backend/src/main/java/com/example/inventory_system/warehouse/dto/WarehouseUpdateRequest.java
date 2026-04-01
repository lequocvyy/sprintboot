package com.example.inventory_system.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WarehouseUpdateRequest {

    @NotBlank(message = "Warehouse name must not be blank")
    @Size(max = 100, message = "Warehouse name must be less than 100 characters")
    private String name;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;

    public WarehouseUpdateRequest() {
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}