package com.example.inventory_system.order.controller;

import com.example.inventory_system.order.dto.OrderResponse;
import com.example.inventory_system.order.request.CreateOrderRequest;
import com.example.inventory_system.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @PostMapping
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return service.create(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping
    public List<OrderResponse> getAll() {
        return service.getAll();
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @PostMapping("/{id}/confirm")
    public OrderResponse confirm(@PathVariable Long id) {
        return service.confirm(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id) {
        return service.cancel(id);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}