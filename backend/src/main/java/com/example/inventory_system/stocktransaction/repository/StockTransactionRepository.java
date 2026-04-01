package com.example.inventory_system.stocktransaction.repository;

import com.example.inventory_system.stocktransaction.entity.StockTransaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByShopId(Long shopId);

    List<StockTransaction> findByShopIdOrderByCreatedAtDesc(Long shopId);

    List<StockTransaction> findByShopIdOrderByCreatedAtDesc(Long shopId, Pageable pageable);

    long countByShopIdAndCreatedAtBetween(Long shopId, LocalDateTime start, LocalDateTime end);

    List<StockTransaction> findByShopIdAndCreatedAtBetweenOrderByCreatedAtAsc(
            Long shopId,
            LocalDateTime start,
            LocalDateTime end
    );
}