package com.example.inventory_system.order.service;

import com.example.inventory_system.order.dto.OrderResponse;
import com.example.inventory_system.order.request.CreateOrderRequest;

import java.util.List;

public interface OrderService {

    OrderResponse create(CreateOrderRequest request);

    List<OrderResponse> getAll();

    OrderResponse getById(Long id);

    OrderResponse confirm(Long id);

    OrderResponse cancel(Long id);

    void delete(Long id);
}