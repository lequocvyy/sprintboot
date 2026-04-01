package com.example.inventory_system.inventory.service;

import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.DuplicateResourceException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.inventory.dto.DecreaseStockRequest;
import com.example.inventory_system.inventory.dto.IncreaseStockRequest;
import com.example.inventory_system.inventory.dto.InventoryCreateRequest;
import com.example.inventory_system.inventory.dto.InventoryResponse;
import com.example.inventory_system.inventory.entity.Inventory;
import com.example.inventory_system.inventory.mapper.InventoryMapper;
import com.example.inventory_system.inventory.repository.InventoryRepository;
import com.example.inventory_system.product.entity.Product;
import com.example.inventory_system.product.repository.ProductRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.warehouse.entity.Warehouse;
import com.example.inventory_system.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryMapper inventoryMapper;
    private final SecurityService securityService;

    public InventoryServiceImpl(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryMapper inventoryMapper,
            SecurityService securityService
    ) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryMapper = inventoryMapper;
        this.securityService = securityService;
    }

    @Override
    public InventoryResponse create(InventoryCreateRequest request) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        if (inventoryRepository.findByProductIdAndWarehouseIdAndShopId(
                request.getProductId(),
                request.getWarehouseId(),
                currentShopId
        ).isPresent()) {
            throw new DuplicateResourceException("Inventory already exists for this product and warehouse in current shop");
        }

        Product product = productRepository.findByIdAndShopId(request.getProductId(), currentShopId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found in current shop with id: " + request.getProductId()
                ));

        Warehouse warehouse = warehouseRepository.findByIdAndShopId(request.getWarehouseId(), currentShopId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Warehouse not found in current shop with id: " + request.getWarehouseId()
                ));

        if (!product.getShop().getId().equals(warehouse.getShop().getId())) {
            throw new BusinessException("Product and warehouse do not belong to the same shop");
        }

        Inventory inventory = new Inventory();
        inventory.setShop(product.getShop());
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setQuantity(request.getQuantity());

        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(savedInventory);
    }

    @Override
    public List<InventoryResponse> getAll() {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        return inventoryRepository.findAllByShopId(currentShopId)
                .stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Override
    public InventoryResponse getById(Long id) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        Inventory inventory = inventoryRepository.findByIdAndShopId(id, currentShopId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found in current shop with id: " + id));

        return inventoryMapper.toResponse(inventory);
    }

    @Override
    @Transactional
    public InventoryResponse increaseStock(IncreaseStockRequest request) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        Inventory inventory = inventoryRepository.findWithLockByProductIdAndWarehouseIdAndShopId(
                        request.getProductId(),
                        request.getWarehouseId(),
                        currentShopId
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory not found in current shop for productId=" + request.getProductId()
                                + " and warehouseId=" + request.getWarehouseId()
                ));

        inventory.setQuantity(inventory.getQuantity() + request.getQuantity());
        Inventory updatedInventory = inventoryRepository.save(inventory);

        return inventoryMapper.toResponse(updatedInventory);
    }

    @Override
    @Transactional
    public InventoryResponse decreaseStock(DecreaseStockRequest request) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        Inventory inventory = inventoryRepository.findWithLockByProductIdAndWarehouseIdAndShopId(
                        request.getProductId(),
                        request.getWarehouseId(),
                        currentShopId
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory not found in current shop for productId=" + request.getProductId()
                                + " and warehouseId=" + request.getWarehouseId()
                ));

        if (inventory.getQuantity() < request.getQuantity()) {
            throw new BusinessException("Not enough stock");
        }

        inventory.setQuantity(inventory.getQuantity() - request.getQuantity());
        Inventory updatedInventory = inventoryRepository.save(inventory);

        return inventoryMapper.toResponse(updatedInventory);
    }

    @Override
    public Integer getTotalStockByProductId(Long productId) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        if (productRepository.findByIdAndShopId(productId, currentShopId).isEmpty()) {
            throw new ResourceNotFoundException("Product not found in current shop with id: " + productId);
        }

        return inventoryRepository.getTotalQuantityByProductIdAndShopId(productId, currentShopId);
    }
}