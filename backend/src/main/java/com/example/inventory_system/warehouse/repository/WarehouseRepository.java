package com.example.inventory_system.warehouse.repository;

import com.example.inventory_system.warehouse.entity.Warehouse;
import com.example.inventory_system.warehouse.entity.WarehouseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    Optional<Warehouse> findByCodeAndShopId(String code, Long shopId);

    boolean existsByCodeAndShopId(String code, Long shopId);

    List<Warehouse> findByShopId(Long shopId);

    Optional<Warehouse> findByIdAndShopId(Long id, Long shopId);

    long countByShopIdAndStatus(Long shopId, WarehouseStatus status);
    

}