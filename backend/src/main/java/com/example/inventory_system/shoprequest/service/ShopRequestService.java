package com.example.inventory_system.shoprequest.service;

import com.example.inventory_system.shoprequest.dto.CreateShopRequestDto;
import com.example.inventory_system.shoprequest.dto.ShopRequestResponse;

import java.util.List;

public interface ShopRequestService {

    ShopRequestResponse createRequest(CreateShopRequestDto dto);

    List<ShopRequestResponse> getPendingRequests();

    ShopRequestResponse approveRequest(Long requestId);
}