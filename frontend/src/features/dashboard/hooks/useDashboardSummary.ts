import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const useDashboardSummary = (params?: {
  recentLimit?: number
  lowStockThreshold?: number
  lowStockLimit?: number
}) => {
  return useQuery({
    queryKey: ['shop-dashboard', 'summary', params],
    queryFn: () => dashboardApi.getSummary(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}