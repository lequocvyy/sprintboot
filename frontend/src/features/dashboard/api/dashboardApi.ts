import { api } from '@/lib/axios'
import type {
  DashboardChartResponse,
  ShopDashboardSummaryResponse,
} from '@/types/dashboard'

export const dashboardApi = {
  getSummary: async (params?: {
    recentLimit?: number
    lowStockThreshold?: number
    lowStockLimit?: number
  }) => {
    const response = await api.get<ShopDashboardSummaryResponse>(
      '/shop-dashboard/summary',
      {
        params: {
          recentLimit: params?.recentLimit ?? 10,
          lowStockThreshold: params?.lowStockThreshold ?? 10,
          lowStockLimit: params?.lowStockLimit ?? 10,
        },
      }
    )

    return response.data
  },

  getChart: async (params?: { days?: number }) => {
    const response = await api.get<DashboardChartResponse>(
      '/shop-dashboard/chart',
      {
        params: {
          days: params?.days ?? 7,
        },
      }
    )

    return response.data
  },
}