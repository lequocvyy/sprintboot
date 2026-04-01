import { api } from "@/lib/axios";

export type PlatformDashboardOverviewResponse = {
  totalShops: number;
  activeShops: number;
  totalUsers: number;
  totalOrders: number;
  totalPackagesSold: number;
  activeSubscriptions: number;
  pendingShopRequests: number;
  approvedShopRequests: number;
  rejectedShopRequests: number;
};

export type PackageSalesItemResponse = {
  packageCode: string;
  soldCount: number;
};

export type PackageSalesResponse = {
  totalPackagesSold: number;
  items: PackageSalesItemResponse[];
};

export type PlatformChartPointResponse = {
  label: string;
  value: number;
};

export type PlatformChartResponse = {
  points: PlatformChartPointResponse[];
};

export const platformDashboardApi = {
  getOverview: async (): Promise<PlatformDashboardOverviewResponse> => {
    const response = await api.get("/platform-dashboard/overview");
    return response.data;
  },

  getPackageSales: async (): Promise<PackageSalesResponse> => {
    const response = await api.get("/platform-dashboard/package-sales");
    return response.data;
  },

  getSubscriptionChart: async (
    months = 6
  ): Promise<PlatformChartResponse> => {
    const response = await api.get("/platform-dashboard/charts/subscriptions", {
      params: { months },
    });
    return response.data;
  },

  getOrderChart: async (days = 7): Promise<PlatformChartResponse> => {
    const response = await api.get("/platform-dashboard/charts/orders", {
      params: { days },
    });
    return response.data;
  },
};