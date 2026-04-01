import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { warehouseApi } from '../api/warehouseApi'
import type {
  WarehouseCreateRequest,
  WarehouseUpdateRequest,
} from '@/types/warehouse'

const WAREHOUSE_QUERY_KEY = ['warehouses']

export const useWarehouses = () => {
  return useQuery({
    queryKey: WAREHOUSE_QUERY_KEY,
    queryFn: warehouseApi.getAll,
  })
}

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WarehouseCreateRequest) => warehouseApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSE_QUERY_KEY })
    },
  })
}

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: WarehouseUpdateRequest
    }) => warehouseApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSE_QUERY_KEY })
    },
  })
}

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => warehouseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSE_QUERY_KEY })
    },
  })
}