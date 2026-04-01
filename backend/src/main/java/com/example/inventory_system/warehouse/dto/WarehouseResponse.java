package com.example.inventory_system.warehouse.dto;

import com.example.inventory_system.warehouse.entity.WarehouseStatus;

public class WarehouseResponse {

    private Long id;
    private String code;
    private String name;
    private String address;
    private WarehouseStatus status;

    public WarehouseResponse() {
    }

    public WarehouseResponse(Long id, String code, String name, String address, WarehouseStatus status) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.address = address;
        this.status = status;
    }

    public Long getId() {
        return id;
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

    public WarehouseStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setStatus(WarehouseStatus status) {
        this.status = status;
    }
}