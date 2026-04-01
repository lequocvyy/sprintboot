package com.example.inventory_system.shop.controller;

import com.example.inventory_system.shop.dto.CreateShopRequest;
import com.example.inventory_system.shop.entity.Shop;
import com.example.inventory_system.shop.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    public Shop createShop(@Valid @RequestBody CreateShopRequest request) {
        return shopService.createShop(request);
    }

    @GetMapping
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }
}