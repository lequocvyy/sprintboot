import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { Role } from "@/types/auth";

export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export function ApprovedShopRoute() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "PLATFORM_ADMIN") {
    return <Outlet />;
  }

  if (!user.passwordChanged) {
    return <Navigate to="/change-password" replace />;
  }

  if (user.role === "SHOP_OWNER" && !user.shopId) {
    if (user.shopRequestStatus === "PENDING") {
      return <Navigate to="/pending-approval" replace />;
    }

    return <Navigate to="/app/shop-request" replace />;
  }

  if ((user.role === "SHOP_MANAGER" || user.role === "SHOP_STAFF") && !user.shopId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}