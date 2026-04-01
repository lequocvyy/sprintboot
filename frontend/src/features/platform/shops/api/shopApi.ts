import { api } from "@/lib/axios";

export interface ShopItem {
  id: number;
  code: string;
  name: string;
  slug: string;
  address?: string | null;
  active: boolean;
}

export const shopApi = {
  getAllShops: async () => {
    const { data } = await api.get<ShopItem[]>("/shops");
    return data;
  },
};