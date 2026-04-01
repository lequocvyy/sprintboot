package com.example.inventory_system.dashboard.dto;

import java.util.List;

public class ShopDashboardSummaryResponse {

    private long totalProducts;
    private long totalActiveWarehouses;
    private long totalStock;
    private long todayTransactionCount;
    private List<DashboardRecentTransactionDto> recentTransactions;
    private List<LowStockAlertDto> lowStockAlerts;

    public ShopDashboardSummaryResponse() {
    }

    public ShopDashboardSummaryResponse(
            long totalProducts,
            long totalActiveWarehouses,
            long totalStock,
            long todayTransactionCount,
            List<DashboardRecentTransactionDto> recentTransactions,
            List<LowStockAlertDto> lowStockAlerts
    ) {
        this.totalProducts = totalProducts;
        this.totalActiveWarehouses = totalActiveWarehouses;
        this.totalStock = totalStock;
        this.todayTransactionCount = todayTransactionCount;
        this.recentTransactions = recentTransactions;
        this.lowStockAlerts = lowStockAlerts;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalActiveWarehouses() {
        return totalActiveWarehouses;
    }

    public void setTotalActiveWarehouses(long totalActiveWarehouses) {
        this.totalActiveWarehouses = totalActiveWarehouses;
    }

    public long getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(long totalStock) {
        this.totalStock = totalStock;
    }

    public long getTodayTransactionCount() {
        return todayTransactionCount;
    }

    public void setTodayTransactionCount(long todayTransactionCount) {
        this.todayTransactionCount = todayTransactionCount;
    }

    public List<DashboardRecentTransactionDto> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<DashboardRecentTransactionDto> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<LowStockAlertDto> getLowStockAlerts() {
        return lowStockAlerts;
    }

    public void setLowStockAlerts(List<LowStockAlertDto> lowStockAlerts) {
        this.lowStockAlerts = lowStockAlerts;
    }
}