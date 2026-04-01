package com.example.inventory_system.dashboard.dto;

import java.util.List;

public class DashboardChartResponse {

    private List<DashboardDailyTransactionPointDto> dailyTransactions;

    public DashboardChartResponse() {
    }

    public DashboardChartResponse(List<DashboardDailyTransactionPointDto> dailyTransactions) {
        this.dailyTransactions = dailyTransactions;
    }

    public List<DashboardDailyTransactionPointDto> getDailyTransactions() {
        return dailyTransactions;
    }

    public void setDailyTransactions(List<DashboardDailyTransactionPointDto> dailyTransactions) {
        this.dailyTransactions = dailyTransactions;
    }
}