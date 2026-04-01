package com.example.inventory_system.stocktransaction.service;

import com.example.inventory_system.common.exception.BusinessException;
import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.inventory.dto.DecreaseStockRequest;
import com.example.inventory_system.inventory.dto.IncreaseStockRequest;
import com.example.inventory_system.inventory.dto.InventoryCreateRequest;
import com.example.inventory_system.inventory.repository.InventoryRepository;
import com.example.inventory_system.inventory.service.InventoryService;
import com.example.inventory_system.product.entity.Product;
import com.example.inventory_system.product.repository.ProductRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.stocktransaction.dto.StockTransactionRequest;
import com.example.inventory_system.stocktransaction.dto.StockTransactionResponse;
import com.example.inventory_system.stocktransaction.entity.StockTransaction;
import com.example.inventory_system.stocktransaction.entity.TransactionType;
import com.example.inventory_system.stocktransaction.mapper.StockTransactionMapper;
import com.example.inventory_system.stocktransaction.repository.StockTransactionRepository;
import com.example.inventory_system.warehouse.entity.Warehouse;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import com.example.inventory_system.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockTransactionServiceImpl implements StockTransactionService {

    private final StockTransactionRepository repository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;
    private final SecurityService securityService;

    public StockTransactionServiceImpl(
            StockTransactionRepository repository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryRepository inventoryRepository,
            InventoryService inventoryService,
            SecurityService securityService
    ) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryService = inventoryService;
        this.securityService = securityService;
    }

    @Override
    @Transactional
    public StockTransactionResponse stockIn(StockTransactionRequest request) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        validateQuantity(request.getQuantity());

        Product product = productRepository.findByIdAndShopId(request.getProductId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in current shop"));

        Warehouse warehouse = warehouseRepository.findByIdAndShopId(request.getWarehouseId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found in current shop"));

        validateWarehouseIsActive(warehouse);

        boolean inventoryExists = inventoryRepository
                .findByProductIdAndWarehouseIdAndShopId(
                        request.getProductId(),
                        request.getWarehouseId(),
                        shopId
                )
                .isPresent();

        if (inventoryExists) {
            IncreaseStockRequest increaseRequest = new IncreaseStockRequest();
            increaseRequest.setProductId(request.getProductId());
            increaseRequest.setWarehouseId(request.getWarehouseId());
            increaseRequest.setQuantity(request.getQuantity());
            inventoryService.increaseStock(increaseRequest);
        } else {
            InventoryCreateRequest createRequest = new InventoryCreateRequest();
            createRequest.setProductId(request.getProductId());
            createRequest.setWarehouseId(request.getWarehouseId());
            createRequest.setQuantity(request.getQuantity());
            inventoryService.create(createRequest);
        }

        StockTransaction tx = new StockTransaction();
        tx.setShop(product.getShop());
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(TransactionType.IN);
        tx.setQuantity(request.getQuantity());
        tx.setReference(request.getReference());
        tx.setNote(request.getNote());
        tx.setCreatedByUsername(securityService.getCurrentUsername());
        tx.setCreatedByRole(securityService.getCurrentRoleName());

        return StockTransactionMapper.toResponse(repository.save(tx));
    }

    @Override
    @Transactional
    public StockTransactionResponse stockOut(StockTransactionRequest request) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        validateQuantity(request.getQuantity());

        Product product = productRepository.findByIdAndShopId(request.getProductId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in current shop"));

        Warehouse warehouse = warehouseRepository.findByIdAndShopId(request.getWarehouseId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found in current shop"));

        validateWarehouseIsActive(warehouse);

        DecreaseStockRequest decreaseRequest = new DecreaseStockRequest();
        decreaseRequest.setProductId(request.getProductId());
        decreaseRequest.setWarehouseId(request.getWarehouseId());
        decreaseRequest.setQuantity(request.getQuantity());

        inventoryService.decreaseStock(decreaseRequest);

        StockTransaction tx = new StockTransaction();
        tx.setShop(product.getShop());
        tx.setProduct(product);
        tx.setWarehouse(warehouse);
        tx.setType(TransactionType.OUT);
        tx.setQuantity(request.getQuantity());
        tx.setReference(request.getReference());
        tx.setNote(request.getNote());
        tx.setCreatedByUsername(securityService.getCurrentUsername());
        tx.setCreatedByRole(securityService.getCurrentRoleName());

        return StockTransactionMapper.toResponse(repository.save(tx));
    }

    @Override
    public List<StockTransactionResponse> getAll() {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        return repository.findByShopId(shopId)
                .stream()
                .map(StockTransactionMapper::toResponse)
                .toList();
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BusinessException("Quantity must be greater than 0");
        }
    }

    private void validateWarehouseIsActive(Warehouse warehouse) {
        if (warehouse.getStatus() != WarehouseStatus.ACTIVE) {
            throw new BusinessException("Cannot perform stock transaction on inactive warehouse");
        }
    }
}