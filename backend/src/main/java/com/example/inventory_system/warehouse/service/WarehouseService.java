package com.example.inventory_system.warehouse.service;

import com.example.inventory_system.warehouse.dto.WarehouseCreateRequest;
import com.example.inventory_system.warehouse.dto.WarehouseResponse;
import com.example.inventory_system.warehouse.dto.WarehouseUpdateRequest;

import java.util.List;

public interface WarehouseService {

    WarehouseResponse create(WarehouseCreateRequest request);

    List<WarehouseResponse> getAll();

    WarehouseResponse getById(Long id);

    WarehouseResponse update(Long id, WarehouseUpdateRequest request);

    void delete(Long id);
}