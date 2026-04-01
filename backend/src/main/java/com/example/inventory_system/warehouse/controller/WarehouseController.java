package com.example.inventory_system.warehouse.controller;

import com.example.inventory_system.warehouse.dto.WarehouseCreateRequest;
import com.example.inventory_system.warehouse.dto.WarehouseResponse;
import com.example.inventory_system.warehouse.dto.WarehouseUpdateRequest;
import com.example.inventory_system.warehouse.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService service;

    public WarehouseController(WarehouseService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarehouseResponse create(@Valid @RequestBody WarehouseCreateRequest request) {
        return service.create(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping
    public List<WarehouseResponse> getAll() {
        return service.getAll();
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping("/{id}")
    public WarehouseResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PutMapping("/{id}")
    public WarehouseResponse update(@PathVariable Long id,
                                    @Valid @RequestBody WarehouseUpdateRequest request) {
        return service.update(id, request);
    }

    @PreAuthorize("hasAuthority('SHOP_OWNER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}