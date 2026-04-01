package com.example.inventory_system.warehouse.mapper;

import com.example.inventory_system.warehouse.dto.WarehouseCreateRequest;
import com.example.inventory_system.warehouse.dto.WarehouseResponse;
import com.example.inventory_system.warehouse.dto.WarehouseUpdateRequest;
import com.example.inventory_system.warehouse.entity.Warehouse;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {

    public Warehouse toEntity(WarehouseCreateRequest request) {
        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        return warehouse;
    }

    public void updateEntity(Warehouse warehouse, WarehouseUpdateRequest request) {
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
    }

    public WarehouseResponse toResponse(Warehouse warehouse) {
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getCode(),
                warehouse.getName(),
                warehouse.getAddress(),
                warehouse.getStatus()
        );
    }
}