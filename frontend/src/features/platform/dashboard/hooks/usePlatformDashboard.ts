import { useQuery } from "@tanstack/react-query";
import { platformDashboardApi } from "../api/dashboardApi";

export const useOverview = () =>
  useQuery({
    queryKey: ["platform-dashboard", "overview"],
    queryFn: platformDashboardApi.getOverview,
  });

export const usePackageSales = () =>
  useQuery({
    queryKey: ["platform-dashboard", "package-sales"],
    queryFn: platformDashboardApi.getPackageSales,
  });

export const useSubscriptionChart = (months = 6) =>
  useQuery({
    queryKey: ["platform-dashboard", "subscription-chart", months],
    queryFn: () => platformDashboardApi.getSubscriptionChart(months),
  });

export const useOrderChart = (days = 7) =>
  useQuery({
    queryKey: ["platform-dashboard", "order-chart", days],
    queryFn: () => platformDashboardApi.getOrderChart(days),
  });