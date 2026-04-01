package com.example.inventory_system.platformdashboard.dto;

public class PackageSalesItemResponse {

    private String packageCode;
    private long soldCount;

    public PackageSalesItemResponse() {
    }

    public PackageSalesItemResponse(String packageCode, long soldCount) {
        this.packageCode = packageCode;
        this.soldCount = soldCount;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public long getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(long soldCount) {
        this.soldCount = soldCount;
    }
}