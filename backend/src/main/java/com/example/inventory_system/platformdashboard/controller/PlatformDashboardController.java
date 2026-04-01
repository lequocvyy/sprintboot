package com.example.inventory_system.platformdashboard.controller;

import com.example.inventory_system.platformdashboard.dto.PackageSalesResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformChartResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformDashboardOverviewResponse;
import com.example.inventory_system.platformdashboard.service.PlatformDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/platform-dashboard")
public class PlatformDashboardController {

    private final PlatformDashboardService platformDashboardService;

    public PlatformDashboardController(PlatformDashboardService platformDashboardService) {
        this.platformDashboardService = platformDashboardService;
    }

    @GetMapping("/overview")
    public PlatformDashboardOverviewResponse getOverview() {
        return platformDashboardService.getOverview();
    }

    @GetMapping("/package-sales")
    public PackageSalesResponse getPackageSales() {
        return platformDashboardService.getPackageSales();
    }

    @GetMapping("/charts/subscriptions")
    public PlatformChartResponse getSubscriptionChart(
            @RequestParam(defaultValue = "6") int months
    ) {
        return platformDashboardService.getSubscriptionChart(months);
    }

    @GetMapping("/charts/orders")
    public PlatformChartResponse getOrderChart(
            @RequestParam(defaultValue = "7") int days
    ) {
        return platformDashboardService.getOrderChart(days);
    }
}