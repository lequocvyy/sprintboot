import { api } from '@/lib/axios'
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
} from '@/types/product'

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products')
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (payload: ProductCreateRequest): Promise<Product> => {
    const response = await api.post('/products', payload)
    return response.data
  },

  update: async (
    id: number,
    payload: ProductUpdateRequest,
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, payload)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
}