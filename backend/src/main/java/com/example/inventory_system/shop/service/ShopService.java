package com.example.inventory_system.shop.service;

import com.example.inventory_system.shop.dto.CreateShopRequest;
import com.example.inventory_system.shop.entity.Shop;

import java.util.List;

public interface ShopService {

    Shop createShop(CreateShopRequest request);

    List<Shop> getAllShops();
}