package com.example.inventory_system.stocktransaction.service;

import com.example.inventory_system.stocktransaction.dto.StockTransactionRequest;
import com.example.inventory_system.stocktransaction.dto.StockTransactionResponse;

import java.util.List;

public interface StockTransactionService {

    StockTransactionResponse stockIn(StockTransactionRequest request);

    StockTransactionResponse stockOut(StockTransactionRequest request);

    List<StockTransactionResponse> getAll();
}