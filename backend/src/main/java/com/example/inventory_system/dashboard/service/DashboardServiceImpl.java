package com.example.inventory_system.dashboard.service;

import com.example.inventory_system.dashboard.dto.DashboardChartResponse;
import com.example.inventory_system.dashboard.dto.DashboardDailyTransactionPointDto;
import com.example.inventory_system.dashboard.dto.DashboardRecentTransactionDto;
import com.example.inventory_system.dashboard.dto.LowStockAlertDto;
import com.example.inventory_system.dashboard.dto.ShopDashboardSummaryResponse;
import com.example.inventory_system.inventory.entity.Inventory;
import com.example.inventory_system.inventory.repository.InventoryRepository;
import com.example.inventory_system.product.repository.ProductRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.stocktransaction.entity.StockTransaction;

import com.example.inventory_system.stocktransaction.repository.StockTransactionRepository;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import com.example.inventory_system.warehouse.repository.WarehouseRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final SecurityService securityService;

    public DashboardServiceImpl(
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryRepository inventoryRepository,
            StockTransactionRepository stockTransactionRepository,
            SecurityService securityService
    ) {
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.securityService = securityService;
    }

    @Override
    public ShopDashboardSummaryResponse getSummary(int recentLimit, int lowStockThreshold, int lowStockLimit) {
        securityService.requireShop();
        Long shopId = securityService.getCurrentShopId();

        long totalProducts = productRepository.countByShopId(shopId);
        long totalActiveWarehouses = warehouseRepository.countByShopIdAndStatus(shopId, WarehouseStatus.ACTIVE);
        long totalStock = inventoryRepository.sumTotalStockByShopIdAndWarehouseStatus(shopId, WarehouseStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

        long todayTransactionCount = stockTransactionRepository.countByShopIdAndCreatedAtBetween(
                shopId,
                startOfToday,
                startOfTomorrow
        );

        List<DashboardRecentTransactionDto> recentTransactions = stockTransactionRepository
                .findByShopIdOrderByCreatedAtDesc(shopId, PageRequest.of(0, recentLimit))
                .stream()
                .map(this::mapRecentTransaction)
                .toList();

        List<LowStockAlertDto> lowStockAlerts = inventoryRepository
                .findLowStockByShopIdAndWarehouseStatus(
                        shopId,
                        WarehouseStatus.ACTIVE,
                        lowStockThreshold,
                        PageRequest.of(0, lowStockLimit)
                )
                .stream()
                .map(this::mapLowStock)
                .toList();

        return new ShopDashboardSummaryResponse(
                totalProducts,
                totalActiveWarehouses,
                totalStock,
                todayTransactionCount,
                recentTransactions,
                lowStockAlerts
        );
    }

    @Override
public DashboardChartResponse getChart(int days) {
    securityService.requireShop();
    Long shopId = securityService.getCurrentShopId();

    if (days <= 0) {
        days = 7;
    }

    LocalDate today = LocalDate.now();
    LocalDate startDate = today.minusDays(days - 1);

    LocalDateTime fromDateTime = startDate.atStartOfDay();
    LocalDateTime toDateTime = today.plusDays(1).atStartOfDay();

    List<StockTransaction> transactions =
            stockTransactionRepository.findByShopIdAndCreatedAtBetweenOrderByCreatedAtAsc(
                    shopId,
                    fromDateTime,
                    toDateTime
            );

    List<DashboardDailyTransactionPointDto> result = new ArrayList<>();

    for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
        final LocalDate currentDate = date;

        List<StockTransaction> transactionsOfDay = transactions.stream()
                .filter(tx -> tx.getCreatedAt() != null && tx.getCreatedAt().toLocalDate().equals(currentDate))
                .toList();

        long transactionCount = transactionsOfDay.size();

        long stockInQuantity = transactionsOfDay.stream()
                .filter(tx -> tx.getType() == com.example.inventory_system.stocktransaction.entity.TransactionType.IN)
                .mapToLong(tx -> tx.getQuantity() != null ? tx.getQuantity() : 0)
                .sum();

        long stockOutQuantity = transactionsOfDay.stream()
                .filter(tx -> tx.getType() == com.example.inventory_system.stocktransaction.entity.TransactionType.OUT)
                .mapToLong(tx -> tx.getQuantity() != null ? tx.getQuantity() : 0)
                .sum();

        result.add(new DashboardDailyTransactionPointDto(
                date.toString(),
                transactionCount,
                stockInQuantity,
                stockOutQuantity
        ));
    }

    return new DashboardChartResponse(result);
}

    private DashboardRecentTransactionDto mapRecentTransaction(StockTransaction tx) {
        DashboardRecentTransactionDto dto = new DashboardRecentTransactionDto();
        dto.setId(tx.getId());
        dto.setProductId(tx.getProduct().getId());
        dto.setProductName(tx.getProduct().getName());
        dto.setWarehouseId(tx.getWarehouse().getId());
        dto.setWarehouseName(tx.getWarehouse().getName());
        dto.setType(tx.getType());
        dto.setQuantity(tx.getQuantity());
        dto.setReference(tx.getReference());
        dto.setNote(tx.getNote());
        dto.setCreatedByUsername(tx.getCreatedByUsername());
        dto.setCreatedByRole(tx.getCreatedByRole());
        dto.setCreatedAt(tx.getCreatedAt());
        return dto;
    }

    private LowStockAlertDto mapLowStock(Inventory inventory) {
        LowStockAlertDto dto = new LowStockAlertDto();
        dto.setInventoryId(inventory.getId());
        dto.setProductId(inventory.getProduct().getId());
        dto.setProductName(inventory.getProduct().getName());
        dto.setProductSku(inventory.getProduct().getSku());
        dto.setWarehouseId(inventory.getWarehouse().getId());
        dto.setWarehouseName(inventory.getWarehouse().getName());
        dto.setWarehouseCode(inventory.getWarehouse().getCode());
        dto.setQuantity(inventory.getQuantity());
        return dto;
    }
}