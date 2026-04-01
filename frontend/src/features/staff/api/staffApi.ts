import { api } from '@/lib/axios'
import type {
  CreateStaffRequest,
  StaffResponse,
  UpdateStaffStatusRequest,
} from '@/types/staff'

export const staffApi = {
  getAll: async () => {
    const response = await api.get<StaffResponse[]>('/users/staff')
    return response.data
  },

  create: async (payload: CreateStaffRequest) => {
    const response = await api.post<StaffResponse>('/users/staff', payload)
    return response.data
  },

  updateStatus: async (id: number, payload: UpdateStaffStatusRequest) => {
    const response = await api.patch<StaffResponse>(`/users/staff/${id}/status`, payload)
    return response.data
  },
}