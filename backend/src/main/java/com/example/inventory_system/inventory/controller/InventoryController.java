package com.example.inventory_system.inventory.controller;

import com.example.inventory_system.inventory.dto.DecreaseStockRequest;
import com.example.inventory_system.inventory.dto.IncreaseStockRequest;
import com.example.inventory_system.inventory.dto.InventoryCreateRequest;
import com.example.inventory_system.inventory.dto.InventoryResponse;
import com.example.inventory_system.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PostMapping
    public InventoryResponse create(@Valid @RequestBody InventoryCreateRequest request) {
        return inventoryService.create(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping
    public List<InventoryResponse> getAll() {
        return inventoryService.getAll();
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping("/{id}")
    public InventoryResponse getById(@PathVariable Long id) {
        return inventoryService.getById(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PutMapping("/increase")
    public InventoryResponse increaseStock(@Valid @RequestBody IncreaseStockRequest request) {
        return inventoryService.increaseStock(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PutMapping("/decrease")
    public InventoryResponse decreaseStock(@Valid @RequestBody DecreaseStockRequest request) {
        return inventoryService.decreaseStock(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping("/total")
    public Integer getTotalStockByProductId(@RequestParam Long productId) {
        return inventoryService.getTotalStockByProductId(productId);
    }
}