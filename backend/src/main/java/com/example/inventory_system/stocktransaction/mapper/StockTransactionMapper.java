package com.example.inventory_system.stocktransaction.mapper;

import com.example.inventory_system.stocktransaction.dto.StockTransactionResponse;
import com.example.inventory_system.stocktransaction.entity.StockTransaction;

public class StockTransactionMapper {

    public static StockTransactionResponse toResponse(StockTransaction transaction) {
        StockTransactionResponse response = new StockTransactionResponse();

        response.setId(transaction.getId());

        response.setProductId(transaction.getProduct().getId());
        response.setProductName(transaction.getProduct().getName());

        response.setWarehouseId(transaction.getWarehouse().getId());
        response.setWarehouseName(transaction.getWarehouse().getName());

        response.setType(transaction.getType());
        response.setQuantity(transaction.getQuantity());
        response.setReference(transaction.getReference());
        response.setNote(transaction.getNote());
        response.setCreatedByUsername(transaction.getCreatedByUsername());
        response.setCreatedByRole(transaction.getCreatedByRole());
        response.setCreatedAt(transaction.getCreatedAt());

        return response;
    }
}