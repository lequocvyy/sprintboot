package com.example.inventory_system.platformdashboard.service;

import com.example.inventory_system.platformdashboard.dto.PackageSalesResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformChartResponse;
import com.example.inventory_system.platformdashboard.dto.PlatformDashboardOverviewResponse;

public interface PlatformDashboardService {

    PlatformDashboardOverviewResponse getOverview();

    PackageSalesResponse getPackageSales();

    PlatformChartResponse getSubscriptionChart(int months);

    PlatformChartResponse getOrderChart(int days);
}