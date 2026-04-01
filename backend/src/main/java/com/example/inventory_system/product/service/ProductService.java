package com.example.inventory_system.product.service;

import com.example.inventory_system.common.exception.ResourceNotFoundException;
import com.example.inventory_system.product.dto.ProductCreateRequest;
import com.example.inventory_system.product.dto.ProductResponse;
import com.example.inventory_system.product.dto.ProductUpdateRequest;
import com.example.inventory_system.product.entity.Product;
import com.example.inventory_system.product.mapper.ProductMapper;
import com.example.inventory_system.product.repository.ProductRepository;
import com.example.inventory_system.security.service.SecurityService;
import com.example.inventory_system.shop.entity.Shop;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final SecurityService securityService;
    

    public ProductService(ProductRepository productRepository,
                          ProductMapper productMapper,
                          SecurityService securityService) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.securityService = securityService;
    }

    public ProductResponse create(ProductCreateRequest request) {
        securityService.requireShop();

        Shop shop = securityService.getCurrentUser().getShop();

        Product product = productMapper.toEntity(request);
        product.setShop(shop);

        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    public List<ProductResponse> getAll() {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        return productRepository.findByShopId(currentShopId)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    public ProductResponse getById(Long id) {
        Product product = findProductByIdInCurrentShop(id);
        return productMapper.toResponse(product);
    }

    public ProductResponse update(Long id, ProductUpdateRequest request) {
        Product product = findProductByIdInCurrentShop(id);
        productMapper.updateEntity(product, request);

        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    public void delete(Long id) {
        Product product = findProductByIdInCurrentShop(id);
        productRepository.delete(product);
    }

    private Product findProductByIdInCurrentShop(Long id) {
        securityService.requireShop();
        Long currentShopId = securityService.getCurrentShopId();

        return productRepository.findByIdAndShopId(id, currentShopId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found in current shop with id: " + id
                ));
    }
}