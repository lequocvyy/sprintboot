package com.example.inventory_system.stocktransaction.controller;

import com.example.inventory_system.stocktransaction.dto.StockTransactionRequest;
import com.example.inventory_system.stocktransaction.dto.StockTransactionResponse;
import com.example.inventory_system.stocktransaction.service.StockTransactionService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class StockTransactionController {

    private final StockTransactionService service;

    public StockTransactionController(StockTransactionService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER')")
    @PostMapping("/in")
    public StockTransactionResponse stockIn(@Valid @RequestBody StockTransactionRequest request) {
        return service.stockIn(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @PostMapping("/out")
    public StockTransactionResponse stockOut(@Valid @RequestBody StockTransactionRequest request) {
        return service.stockOut(request);
    }

    @PreAuthorize("hasAnyAuthority('SHOP_OWNER','SHOP_MANAGER','SHOP_STAFF')")
    @GetMapping
    public List<StockTransactionResponse> getAll() {
        return service.getAll();
    }
}