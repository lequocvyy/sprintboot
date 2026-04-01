import { api } from '@/lib/axios'
import type {
  Warehouse,
  WarehouseCreateRequest,
  WarehouseUpdateRequest,
} from '@/types/warehouse'

export const warehouseApi = {
  getAll: async (): Promise<Warehouse[]> => {
    const response = await api.get('/warehouses')
    return response.data
  },

  getById: async (id: number): Promise<Warehouse> => {
    const response = await api.get(`/warehouses/${id}`)
    return response.data
  },

  create: async (payload: WarehouseCreateRequest): Promise<Warehouse> => {
    const response = await api.post('/warehouses', payload)
    return response.data
  },

  update: async (
    id: number,
    payload: WarehouseUpdateRequest,
  ): Promise<Warehouse> => {
    const response = await api.put(`/warehouses/${id}`, payload)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/warehouses/${id}`)
  },
}