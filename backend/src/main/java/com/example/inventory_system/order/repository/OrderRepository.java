package com.example.inventory_system.order.repository;

import com.example.inventory_system.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCodeAndShopId(String orderCode, Long shopId);

    boolean existsByOrderCodeAndShopId(String orderCode, Long shopId);

    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    Optional<Order> findByIdAndShopId(Long id, Long shopId);

    @Query("""
            select function('date', o.createdAt), count(o)
            from Order o
            where o.createdAt >= :from
              and o.createdAt < :to
            group by function('date', o.createdAt)
            order by function('date', o.createdAt)
            """)
    List<Object[]> countOrdersByDay(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}