import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '../api/inventoryApi'
import type {
  DecreaseStockRequest,
  IncreaseStockRequest,
  InventoryCreateRequest,
} from '@/types/inventory'

const INVENTORY_QUERY_KEY = ['inventories']

export const useInventories = () => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: inventoryApi.getAll,
  })
}

export const useCreateInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InventoryCreateRequest) => inventoryApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY })
    },
  })
}

export const useIncreaseStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IncreaseStockRequest) => inventoryApi.increaseStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY })
    },
  })
}

export const useDecreaseStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DecreaseStockRequest) => inventoryApi.decreaseStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY })
    },
  })
}