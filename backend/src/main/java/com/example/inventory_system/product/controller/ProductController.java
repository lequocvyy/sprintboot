package com.example.inventory_system.product.controller;

import com.example.inventory_system.product.dto.ProductCreateRequest;
import com.example.inventory_system.product.dto.ProductResponse;
import com.example.inventory_system.product.dto.ProductUpdateRequest;
import com.example.inventory_system.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductCreateRequest request) {
        return productService.create(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping
    public List<ProductResponse> getAll() {
        return productService.getAll();
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id,
                                  @Valid @RequestBody ProductUpdateRequest request) {
        return productService.update(id, request);
    }

    @PreAuthorize("hasAuthority('SHOP_OWNER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}