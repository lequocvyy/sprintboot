package com.example.inventory_system.platformdashboard.dto;

import java.util.List;

public class PackageSalesResponse {

    private long totalPackagesSold;
    private List<PackageSalesItemResponse> items;

    public PackageSalesResponse() {
    }

    public PackageSalesResponse(long totalPackagesSold, List<PackageSalesItemResponse> items) {
        this.totalPackagesSold = totalPackagesSold;
        this.items = items;
    }

    public long getTotalPackagesSold() {
        return totalPackagesSold;
    }

    public void setTotalPackagesSold(long totalPackagesSold) {
        this.totalPackagesSold = totalPackagesSold;
    }

    public List<PackageSalesItemResponse> getItems() {
        return items;
    }

    public void setItems(List<PackageSalesItemResponse> items) {
        this.items = items;
    }
}