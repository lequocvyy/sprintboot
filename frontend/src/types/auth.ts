export type Role =
  | "PLATFORM_ADMIN"
  | "SHOP_OWNER"
  | "SHOP_MANAGER"
  | "SHOP_STAFF";

export type ShopRequestStatus =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  shopId?: number | null;
  shopName?: string | null;
  platformAdmin?: boolean;
  roles?: string[];
  passwordChanged?: boolean;
  shopRequestStatus?: ShopRequestStatus;
}

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  shopId: number | null;
  shopName: string | null;
  platformAdmin: boolean;
  roles: string[];
  passwordChanged: boolean;
  shopRequestStatus: ShopRequestStatus;
}

export interface AuthState {
  accessToken: string | null;
  user: CurrentUser | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: CurrentUser | null) => void;
  logout: () => void;
}