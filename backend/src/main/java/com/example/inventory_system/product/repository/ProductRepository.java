package com.example.inventory_system.product.repository;

import com.example.inventory_system.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    Optional<Product> findByIdAndShopId(Long id, Long shopId);

    long countByShopId(Long shopId);

    
}