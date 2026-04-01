package com.example.inventory_system.dashboard.service;

import com.example.inventory_system.dashboard.dto.DashboardChartResponse;
import com.example.inventory_system.dashboard.dto.ShopDashboardSummaryResponse;

public interface DashboardService {

    ShopDashboardSummaryResponse getSummary(int recentLimit, int lowStockThreshold, int lowStockLimit);

    DashboardChartResponse getChart(int days);
}