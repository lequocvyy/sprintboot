import { api } from '@/lib/axios'
import type {
  DecreaseStockRequest,
  IncreaseStockRequest,
  Inventory,
  InventoryCreateRequest,
} from '@/types/inventory'

export const inventoryApi = {
  getAll: async (): Promise<Inventory[]> => {
    const response = await api.get('/inventories')
    return response.data
  },

  getById: async (id: number): Promise<Inventory> => {
    const response = await api.get(`/inventories/${id}`)
    return response.data
  },

  create: async (payload: InventoryCreateRequest): Promise<Inventory> => {
    const response = await api.post('/inventories', payload)
    return response.data
  },

  increaseStock: async (payload: IncreaseStockRequest): Promise<Inventory> => {
    const response = await api.put('/inventories/increase', payload)
    return response.data
  },

  decreaseStock: async (payload: DecreaseStockRequest): Promise<Inventory> => {
    const response = await api.put('/inventories/decrease', payload)
    return response.data
  },

  getTotalStockByProductId: async (productId: number): Promise<number> => {
    const response = await api.get('/inventories/total', {
      params: { productId },
    })
    return response.data
  },
}