package com.example.inventory_system.platformdashboard.dto;

public class PlatformDashboardOverviewResponse {

    private long totalShops;
    private long activeShops;
    private long totalUsers;
    private long totalOrders;
    private long totalPackagesSold;
    private long activeSubscriptions;
    private long pendingShopRequests;
    private long approvedShopRequests;
    private long rejectedShopRequests;

    public PlatformDashboardOverviewResponse() {
    }

    public PlatformDashboardOverviewResponse(
            long totalShops,
            long activeShops,
            long totalUsers,
            long totalOrders,
            long totalPackagesSold,
            long activeSubscriptions,
            long pendingShopRequests,
            long approvedShopRequests,
            long rejectedShopRequests
    ) {
        this.totalShops = totalShops;
        this.activeShops = activeShops;
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalPackagesSold = totalPackagesSold;
        this.activeSubscriptions = activeSubscriptions;
        this.pendingShopRequests = pendingShopRequests;
        this.approvedShopRequests = approvedShopRequests;
        this.rejectedShopRequests = rejectedShopRequests;
    }

    public long getTotalShops() {
        return totalShops;
    }

    public void setTotalShops(long totalShops) {
        this.totalShops = totalShops;
    }

    public long getActiveShops() {
        return activeShops;
    }

    public void setActiveShops(long activeShops) {
        this.activeShops = activeShops;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalPackagesSold() {
        return totalPackagesSold;
    }

    public void setTotalPackagesSold(long totalPackagesSold) {
        this.totalPackagesSold = totalPackagesSold;
    }

    public long getActiveSubscriptions() {
        return activeSubscriptions;
    }

    public void setActiveSubscriptions(long activeSubscriptions) {
        this.activeSubscriptions = activeSubscriptions;
    }

    public long getPendingShopRequests() {
        return pendingShopRequests;
    }

    public void setPendingShopRequests(long pendingShopRequests) {
        this.pendingShopRequests = pendingShopRequests;
    }

    public long getApprovedShopRequests() {
        return approvedShopRequests;
    }

    public void setApprovedShopRequests(long approvedShopRequests) {
        this.approvedShopRequests = approvedShopRequests;
    }

    public long getRejectedShopRequests() {
        return rejectedShopRequests;
    }

    public void setRejectedShopRequests(long rejectedShopRequests) {
        this.rejectedShopRequests = rejectedShopRequests;
    }
}