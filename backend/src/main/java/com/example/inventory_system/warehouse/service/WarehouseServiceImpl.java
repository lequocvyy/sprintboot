package com.example.inventory_system.warehouse.service;

import com.example.inventory_system.common.exception.DuplicateResourceException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.shop.entity.Shop;
import com.example.inventory_system.warehouse.dto.WarehouseCreateRequest;
import com.example.inventory_system.warehouse.dto.WarehouseResponse;
import com.example.inventory_system.warehouse.dto.WarehouseUpdateRequest;
import com.example.inventory_system.warehouse.entity.Warehouse;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import com.example.inventory_system.warehouse.mapper.WarehouseMapper;
import com.example.inventory_system.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository repository;
    private final WarehouseMapper warehouseMapper;
    private final SecurityService securityService;

    public WarehouseServiceImpl(WarehouseRepository repository,
                                WarehouseMapper warehouseMapper,
                                SecurityService securityService) {
        this.repository = repository;
        this.warehouseMapper = warehouseMapper;
        this.securityService = securityService;
    }

    @Override
    public WarehouseResponse create(WarehouseCreateRequest request) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        if (repository.existsByCodeAndShopId(request.getCode(), currentShopId)) {
            throw new DuplicateResourceException("Warehouse code already exists in current shop: " + request.getCode());
        }

        Warehouse warehouse = warehouseMapper.toEntity(request);
        warehouse.setStatus(WarehouseStatus.ACTIVE);

        Shop shop = securityService.getCurrentUser().getShop();
        warehouse.setShop(shop);

        Warehouse savedWarehouse = repository.save(warehouse);
        return warehouseMapper.toResponse(savedWarehouse);
    }

    @Override
    public List<WarehouseResponse> getAll() {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        return repository.findByShopId(currentShopId)
                .stream()
                .map(warehouseMapper::toResponse)
                .toList();
    }

    @Override
    public WarehouseResponse getById(Long id) {
        Warehouse warehouse = findByIdInCurrentShop(id);
        return warehouseMapper.toResponse(warehouse);
    }

    @Override
    public WarehouseResponse update(Long id, WarehouseUpdateRequest request) {
        Warehouse warehouse = findByIdInCurrentShop(id);

        warehouseMapper.updateEntity(warehouse, request);

        Warehouse updatedWarehouse = repository.save(warehouse);
        return warehouseMapper.toResponse(updatedWarehouse);
    }

    @Override
    public void delete(Long id) {
        Warehouse warehouse = findByIdInCurrentShop(id);

        warehouse.setStatus(WarehouseStatus.INACTIVE);
        repository.save(warehouse);
    }

    private Warehouse findByIdInCurrentShop(Long id) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        return repository.findByIdAndShopId(id, currentShopId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Warehouse not found in current shop with id: " + id
                ));
    }
}