import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, CurrentUser } from "@/types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      setUser: (user: CurrentUser | null) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "inventory-auth",
    }
  )
);