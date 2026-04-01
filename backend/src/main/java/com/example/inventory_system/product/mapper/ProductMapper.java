package com.example.inventory_system.product.mapper;

import com.example.inventory_system.product.dto.ProductCreateRequest;
import com.example.inventory_system.product.dto.ProductResponse;
import com.example.inventory_system.product.dto.ProductUpdateRequest;
import com.example.inventory_system.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductCreateRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        return product;
    }

    public void updateEntity(Product product, ProductUpdateRequest request) {
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getPrice()
        );
    }
}