import { api } from '@/lib/axios'
import type { CreateOrderRequest, Order } from '@/types/order'

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders')
    return response.data
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  create: async (payload: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', payload)
    return response.data
  },

  confirm: async (id: number): Promise<Order> => {
    const response = await api.post(`/orders/${id}/confirm`)
    return response.data
  },

  cancel: async (id: number): Promise<Order> => {
    const response = await api.post(`/orders/${id}/cancel`)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`)
  },
}