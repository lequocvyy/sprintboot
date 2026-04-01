import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function PlatformLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white p-4">
        <div className="mb-6 text-xl font-bold">Platform Admin</div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/platform/dashboard">Dashboard</Link>
          <Link to="/platform/shop-requests">Shop Requests</Link>
          <Link to="/platform/shops">Shops</Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <div className="font-semibold">Platform Console</div>
            <div className="text-sm text-slate-500">{user?.username}</div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}