import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopRequestApi } from "../api/shopRequestApi";

export function useShopRequests() {
  return useQuery({
    queryKey: ["shop-requests", "pending"],
    queryFn: shopRequestApi.getPendingRequests,
  });
}

export function useApproveShopRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shopRequestApi.approveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-requests"] });
    },
  });
}