package com.example.inventory_system.inventory.service;

import com.example.inventory_system.inventory.dto.DecreaseStockRequest;
import com.example.inventory_system.inventory.dto.IncreaseStockRequest;
import com.example.inventory_system.inventory.dto.InventoryCreateRequest;
import com.example.inventory_system.inventory.dto.InventoryResponse;

import java.util.List;

public interface InventoryService {

    InventoryResponse create(InventoryCreateRequest request);

    List<InventoryResponse> getAll();

    InventoryResponse getById(Long id);

    InventoryResponse increaseStock(IncreaseStockRequest request);

    InventoryResponse decreaseStock(DecreaseStockRequest request);

    Integer getTotalStockByProductId(Long productId);
}