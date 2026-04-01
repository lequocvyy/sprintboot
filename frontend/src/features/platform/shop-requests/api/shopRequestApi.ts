import { api } from "@/lib/axios";
import type {
  ShopRequestResponse,
  CreateShopRequestDto,
} from "../types";

export const shopRequestApi = {
  getPendingRequests: async () => {
    const { data } = await api.get<ShopRequestResponse[]>(
      "/shop-requests/pending"
    );
    return data;
  },

  approveRequest: async (id: number) => {
    const { data } = await api.post<ShopRequestResponse>(
      `/shop-requests/${id}/approve`
    );
    return data;
  },

  createRequest: async (payload: CreateShopRequestDto) => {
    const { data } = await api.post<ShopRequestResponse>(
      "/shop-requests",
      payload
    );
    return data;
  },
};