import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Boxes,
  ArrowLeftRight,
  Users,
  LogOut,
  Store,
  ShoppingCart,
} from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
};

export default function AppLayout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navItems: NavItem[] = [
    {
      to: "/app/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/app/products",
      label: "Products",
      icon: Package,
    },
    {
      to: "/app/warehouses",
      label: "Warehouses",
      icon: Warehouse,
    },
    {
      to: "/app/inventory",
      label: "Inventory",
      icon: Boxes,
    },
    {
      to: "/app/transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
    },
    {
  to: "/app/orders",
  label: "Orders",
  icon: ShoppingCart,
  roles: ["SHOP_OWNER", "SHOP_MANAGER", "SHOP_STAFF"],
},
    {
      to: "/app/staff",
      label: "Staff",
      icon: Users,
      roles: ["SHOP_OWNER", "SHOP_MANAGER"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role ?? "");
  });

  const pageTitle = useMemo(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.to));
    return current?.label ?? "Dashboard";
  }, [location.pathname]);

  const initials = useMemo(() => {
    const name = user?.fullName?.trim();
    if (!name) return "U";

    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";

    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }, [user?.fullName]);

  const roleLabel = useMemo(() => {
    switch (user?.role) {
      case "SHOP_OWNER":
        return "Shop Owner";
      case "SHOP_MANAGER":
        return "Shop Manager";
      case "SHOP_STAFF":
        return "Shop Staff";
      default:
        return "User";
    }
  }, [user?.role]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");

  const iconClass = (isActive: boolean) =>
    isActive ? "h-4 w-4 text-white" : "h-4 w-4 text-slate-500 group-hover:text-slate-700";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-base font-bold text-white shadow-sm">
                IS
              </div>

              <div>
                <div className="text-base font-bold text-slate-900">Inventory SaaS</div>
                <div className="text-xs text-slate-500">Shop management system</div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-5">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Main Menu
            </div>

            <nav className="space-y-1.5">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to);

                return (
                  <NavLink key={item.to} to={item.to} className={navClass}>
                    <Icon className={iconClass(isActive)} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Store className="h-4 w-4" />
                {user?.shopName ?? "My Shop"}
              </div>
              <p className="text-xs text-slate-500">
                Quản lý sản phẩm, kho và giao dịch trong một nơi.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {user?.shopName ?? "My Shop"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold text-slate-900">
                    {user?.fullName ?? "User"}
                  </div>
                  <div className="text-xs text-slate-500">{roleLabel}</div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {initials}
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Current workspace</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-semibold text-slate-900">
                        {user?.shopName ?? "My Shop"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500">
                    Welcome back,{" "}
                    <span className="font-semibold text-slate-700">
                      {user?.fullName ?? "User"}
                    </span>
                  </div>
                </div>
              </div>

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}