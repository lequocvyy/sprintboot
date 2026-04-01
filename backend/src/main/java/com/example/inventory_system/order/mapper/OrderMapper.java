package com.example.inventory_system.order.mapper;

import com.example.inventory_system.order.dto.OrderItemResponse;
import com.example.inventory_system.order.dto.OrderResponse;
import com.example.inventory_system.order.entity.Order;
import com.example.inventory_system.order.entity.OrderItem;

import java.util.List;

public class OrderMapper {

    public static OrderResponse toResponse(Order order) {
    OrderResponse response = new OrderResponse();
    response.setId(order.getId());
    response.setOrderCode(order.getOrderCode());
    response.setCustomerName(order.getCustomerName());
    response.setStatus(order.getStatus().name());
    response.setWarehouseId(order.getWarehouseId());
    response.setCreatedAt(order.getCreatedAt());

    List<OrderItemResponse> itemResponses = order.getItems()
            .stream()
            .map(OrderMapper::toItemResponse)
            .toList();

    response.setItems(itemResponses);

    // 🔥 ADD ĐOẠN NÀY
    double totalAmount = order.getItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();

    response.setTotalAmount(totalAmount);

    return response;
}

    public static OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setProductSku(item.getProduct().getSku());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        return response;
    }
}