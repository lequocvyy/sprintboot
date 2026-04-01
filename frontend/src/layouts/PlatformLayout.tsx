import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

const menuItems = [
  { label: "Dashboard", to: "/platform/dashboard" },
  { label: "Shop Requests", to: "/platform/shop-requests" },
  { label: "Shops", to: "/platform/shops" },
];

export default function PlatformLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="flex w-72 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-6">
            <h1 className="text-3xl font-bold text-slate-900">Platform Admin</h1>
            <p className="mt-1 text-sm text-slate-500">
              System administration console
            </p>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="m-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {user?.username || "platformadmin"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              PLATFORM_ADMIN
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Platform Console
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back, {user?.username || "platformadmin"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </header>

          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}