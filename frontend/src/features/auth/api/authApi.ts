import { api } from "@/lib/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export interface SubscriptionPackageResponse {
  code: string;
  name: string;
  durationDays: number;
  price: number;
}

export interface OwnerRegistrationRequest {
  fullName: string;
  email: string;
  packageCode: string;
}

export interface OwnerRegistrationResponse {
  userId: number;
  email: string;
  packageCode: string;
  subscriptionEndAt: string;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  getPackages: async () => {
    const { data } = await api.get<SubscriptionPackageResponse[]>(
      "/auth/public/packages"
    );
    return data;
  },

  registerOwner: async (payload: OwnerRegistrationRequest) => {
    const { data } = await api.post<OwnerRegistrationResponse>(
      "/auth/public/register-owner",
      payload
    );
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const { data } = await api.post<string>("/auth/change-password", payload);
    return data;
  },
};