import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

export const useDashboardChart = (params?: { days?: number }) => {
  return useQuery({
    queryKey: ['shop-dashboard', 'chart', params],
    queryFn: () => dashboardApi.getChart(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}