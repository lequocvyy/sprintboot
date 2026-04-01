import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionApi } from '../api/transactionApi'
import type { StockTransactionRequest } from '@/types/transaction'

const QUERY_KEY = ['transactions']
const DASHBOARD_SUMMARY_QUERY_KEY = ['shop-dashboard', 'summary']
const DASHBOARD_CHART_QUERY_KEY = ['shop-dashboard', 'chart']

export const useTransactions = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: transactionApi.getAll,
  })
}

export const useStockIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StockTransactionRequest) =>
      transactionApi.stockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['inventories'] })
      queryClient.invalidateQueries({ queryKey: DASHBOARD_SUMMARY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: DASHBOARD_CHART_QUERY_KEY })
    },
  })
}

export const useStockOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StockTransactionRequest) =>
      transactionApi.stockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['inventories'] })
      queryClient.invalidateQueries({ queryKey: DASHBOARD_SUMMARY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: DASHBOARD_CHART_QUERY_KEY })
    },
  })
}