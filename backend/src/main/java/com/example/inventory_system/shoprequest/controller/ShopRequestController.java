package com.example.inventory_system.shoprequest.controller;

import com.example.inventory_system.shoprequest.dto.CreateShopRequestDto;
import com.example.inventory_system.shoprequest.dto.ShopRequestResponse;
import com.example.inventory_system.shoprequest.service.ShopRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop-requests")
public class ShopRequestController {

    private final ShopRequestService shopRequestService;

    public ShopRequestController(ShopRequestService shopRequestService) {
        this.shopRequestService = shopRequestService;
    }

    @PostMapping
    public ShopRequestResponse create(@Valid @RequestBody CreateShopRequestDto dto) {
        return shopRequestService.createRequest(dto);
    }

    @GetMapping("/pending")
    public List<ShopRequestResponse> getPendingRequests() {
        return shopRequestService.getPendingRequests();
    }

    @PostMapping("/{id}/approve")
    public ShopRequestResponse approveRequest(@PathVariable Long id) {
        return shopRequestService.approveRequest(id);
    }
}