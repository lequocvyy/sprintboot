package com.example.inventory_system.dashboard.controller;

import com.example.inventory_system.dashboard.dto.DashboardChartResponse;
import com.example.inventory_system.dashboard.dto.ShopDashboardSummaryResponse;
import com.example.inventory_system.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop-dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ShopDashboardSummaryResponse getSummary(
            @RequestParam(defaultValue = "10") int recentLimit,
            @RequestParam(defaultValue = "10") int lowStockThreshold,
            @RequestParam(defaultValue = "10") int lowStockLimit
    ) {
        return dashboardService.getSummary(recentLimit, lowStockThreshold, lowStockLimit);
    }

    @GetMapping("/chart")
    public DashboardChartResponse getChart(
            @RequestParam(defaultValue = "7") int days
    ) {
        return dashboardService.getChart(days);
    }
}