export type ShopRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ShopRequestResponse {
  id: number;
  shopName: string;
  shopSlug: string;
  address: string;
  status: ShopRequestStatus;
  requestedByUserId: number;
  requestedByUsername: string;
  approvedAt?: string | null;
}

export interface CreateShopRequestDto {
  shopName: string;
  shopSlug: string;
  address?: string;
}