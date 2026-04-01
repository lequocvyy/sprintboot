package com.example.inventory_system.dashboard.dto;

public class DashboardDailyTransactionPointDto {

    private String date;
    private long transactionCount;
    private long stockInQuantity;
    private long stockOutQuantity;

    public DashboardDailyTransactionPointDto() {
    }

    public DashboardDailyTransactionPointDto(
            String date,
            long transactionCount,
            long stockInQuantity,
            long stockOutQuantity
    ) {
        this.date = date;
        this.transactionCount = transactionCount;
        this.stockInQuantity = stockInQuantity;
        this.stockOutQuantity = stockOutQuantity;
    }

    public String getDate() {
        return date;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public long getStockInQuantity() {
        return stockInQuantity;
    }

    public long getStockOutQuantity() {
        return stockOutQuantity;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public void setStockInQuantity(long stockInQuantity) {
        this.stockInQuantity = stockInQuantity;
    }

    public void setStockOutQuantity(long stockOutQuantity) {
        this.stockOutQuantity = stockOutQuantity;
    }
}