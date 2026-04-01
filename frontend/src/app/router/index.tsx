import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import PlatformLayout from "@/layouts/PlatformLayout";
import PublicLayout from "@/layouts/PublicLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterOwnerPage from "@/features/auth/pages/RegisterOwnerPage";
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/HomePage";
import PendingApprovalPage from "@/pages/PendingApprovalPage";
import ShopDashboardPage from "@/features/dashboard/ShopDashboardPage";
import PlatformDashboardPage from "@/features/platform/dashboard/PlatformDashboardPage";
import ShopsPage from "@/features/platform/shops/pages/ShopsPage";
import { ApprovedShopRoute, ProtectedRoute, RoleRoute } from "./guards";
import ShopRequestsPage from "@/features/platform/shop-requests/pages/ShopRequestsPage";
import CreateShopRequestPage from "@/features/platform/shop-requests/pages/CreateShopRequestPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import WarehousesPage from "@/features/warehouses/pages/WarehousesPage";
import InventoryPage from "@/features/inventory/pages/InventoryPage";
import TransactionsPage from "@/features/transactions/pages/TransactionsPage";
import StaffPage from "@/features/staff/pages/StaffPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register-owner", element: <RegisterOwnerPage /> },
      { path: "/change-password", element: <ChangePasswordPage /> },
      { path: "/pending-approval", element: <PendingApprovalPage /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["PLATFORM_ADMIN"]} />,
        children: [
          {
            path: "/platform",
            element: <PlatformLayout />,
            children: [
              { path: "dashboard", element: <PlatformDashboardPage /> },
              { path: "shop-requests", element: <ShopRequestsPage /> },
              { path: "shops", element: <ShopsPage /> },
            ],
          },
        ],
      },
      {
        element: (
          <RoleRoute
            allowedRoles={["SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF"]}
          />
        ),
        children: [
          {
            path: "/app/shop-request",
            element: <CreateShopRequestPage />,
          },
          {
            element: <ApprovedShopRoute />,
            children: [
              {
                path: "/app",
                element: <AppLayout />,
                children: [
                  { path: "dashboard", element: <ShopDashboardPage /> },
                  { path: "products", element: <ProductsPage /> },
                  { path: "warehouses", element: <WarehousesPage /> },
                  { path: "inventory", element: <InventoryPage /> },
                  { path: "transactions", element: <TransactionsPage /> },
                  { path: "orders", element: <OrdersPage /> },
                  { path: "staff", element: <StaffPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);