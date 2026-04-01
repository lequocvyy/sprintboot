package com.example.inventory_system.order.repository;

import com.example.inventory_system.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCodeAndShopId(String orderCode, Long shopId);

    boolean existsByOrderCodeAndShopId(String orderCode, Long shopId);

    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    Optional<Order> findByIdAndShopId(Long id, Long shopId);
}