package com.example.inventory_system.inventory.repository;

import com.example.inventory_system.inventory.entity.Inventory;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findAllByShopId(Long shopId);

    Optional<Inventory> findByIdAndShopId(Long id, Long shopId);

    Optional<Inventory> findByProductIdAndWarehouseIdAndShopId(Long productId, Long warehouseId, Long shopId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT i
            FROM Inventory i
            WHERE i.product.id = :productId
              AND i.warehouse.id = :warehouseId
              AND i.shop.id = :shopId
            """)
    Optional<Inventory> findWithLockByProductIdAndWarehouseIdAndShopId(Long productId, Long warehouseId, Long shopId);

    @Query("""
            SELECT COALESCE(SUM(i.quantity), 0)
            FROM Inventory i
            WHERE i.product.id = :productId
              AND i.shop.id = :shopId
            """)
    Integer getTotalQuantityByProductIdAndShopId(Long productId, Long shopId);

    @Query("""
            SELECT COALESCE(SUM(i.quantity), 0)
            FROM Inventory i
            WHERE i.shop.id = :shopId
              AND i.warehouse.status = :status
            """)
    Long sumTotalStockByShopIdAndWarehouseStatus(Long shopId, WarehouseStatus status);

    @Query("""
            SELECT i
            FROM Inventory i
            WHERE i.shop.id = :shopId
              AND i.warehouse.status = :status
              AND i.quantity <= :threshold
            ORDER BY i.quantity ASC, i.id DESC
            """)
    List<Inventory> findLowStockByShopIdAndWarehouseStatus(
            Long shopId,
            WarehouseStatus status,
            Integer threshold,
            Pageable pageable
    );
}