package com.example.inventory_system.shop.repository;

import com.example.inventory_system.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    Optional<Shop> findByCode(String code);

    Optional<Shop> findBySlug(String slug);

    boolean existsByCode(String code);

    boolean existsBySlug(String slug);

    long countByActiveTrue();
}