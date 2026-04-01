import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '../api/staffApi'
import type { CreateStaffRequest, UpdateStaffStatusRequest } from '@/types/staff'

export const STAFF_QUERY_KEY = ['staffs']

export const useStaffs = () => {
  return useQuery({
    queryKey: STAFF_QUERY_KEY,
    queryFn: staffApi.getAll,
  })
}

export const useCreateStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStaffRequest) => staffApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
    },
  })
}

export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateStaffStatusRequest
    }) => staffApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
    },
  })
}