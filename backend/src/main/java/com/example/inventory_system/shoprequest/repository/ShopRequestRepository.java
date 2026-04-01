package com.example.inventory_system.shoprequest.repository;

import com.example.inventory_system.shoprequest.entity.ShopRequest;
import com.example.inventory_system.shoprequest.entity.ShopRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopRequestRepository extends JpaRepository<ShopRequest, Long> {

    List<ShopRequest> findByStatus(ShopRequestStatus status);

    boolean existsByRequestedByIdAndStatus(Long userId, ShopRequestStatus status);

    long countByStatus(ShopRequestStatus status);
}