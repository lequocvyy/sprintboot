import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../api/productApi'
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
} from '@/types/product'

export const PRODUCT_QUERY_KEY = ['products']

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEY,
    queryFn: productApi.getAll,
  })
}

export const useProduct = (id?: number) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, id],
    queryFn: () => productApi.getById(id as number),
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductCreateRequest) => productApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: ProductUpdateRequest
    }) => productApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...PRODUCT_QUERY_KEY, variables.id],
      })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY })
    },
  })
}