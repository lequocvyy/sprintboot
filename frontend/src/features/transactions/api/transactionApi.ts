import { api } from '@/lib/axios'
import type {
  StockTransaction,
  StockTransactionRequest,
} from '@/types/transaction'

export const transactionApi = {
  getAll: async (): Promise<StockTransaction[]> => {
    const response = await api.get('/transactions')
    return response.data
  },

  stockIn: async (
    payload: StockTransactionRequest,
  ): Promise<StockTransaction> => {
    const response = await api.post('/transactions/in', payload)
    return response.data
  },

  stockOut: async (
    payload: StockTransactionRequest,
  ): Promise<StockTransaction> => {
    const response = await api.post('/transactions/out', payload)
    return response.data
  },
}