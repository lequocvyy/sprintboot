import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { Role } from "@/types/auth";

function resolvePrimaryRole(
  roles: string[] | undefined,
  platformAdmin?: boolean
): Role {
  if (platformAdmin) return "PLATFORM_ADMIN";
  if (!roles || roles.length === 0) return "SHOP_STAFF";

  if (roles.includes("PLATFORM_ADMIN")) return "PLATFORM_ADMIN";
  if (roles.includes("SHOP_OWNER")) return "SHOP_OWNER";
  if (roles.includes("SHOP_MANAGER")) return "SHOP_MANAGER";
  return "SHOP_STAFF";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authApi.login({ username, password });

      setAccessToken(res.accessToken);

      const role = resolvePrimaryRole(res.roles, res.platformAdmin);

      const user = {
        id: res.userId,
        username: res.username,
        fullName: res.username,
        role,
        shopId: res.shopId ?? null,
        shopName: res.shopName ?? null,
        platformAdmin: res.platformAdmin ?? false,
        roles: res.roles ?? [],
        passwordChanged: res.passwordChanged ?? false,
        shopRequestStatus: res.shopRequestStatus ?? "NONE",
      };

      setUser(user);

      if (role === "PLATFORM_ADMIN") {
        navigate("/platform/dashboard", { replace: true });
        return;
      }

      if (!user.passwordChanged) {
        navigate("/change-password", { replace: true });
        return;
      }

      if (role === "SHOP_OWNER" && !user.shopId) {
        if (user.shopRequestStatus === "PENDING") {
          navigate("/pending-approval", { replace: true });
          return;
        }

        navigate("/app/shop-request", { replace: true });
        return;
      }

      navigate("/app/dashboard", { replace: true });
    } catch (error: unknown) {
      setErrorMsg("Sai username hoặc mật khẩu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Đăng nhập</h1>
      <p className="mb-6 text-sm text-slate-500">
        Đăng nhập vào hệ thống Inventory SaaS
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username (ex: platformadmin): "
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password:"
          />
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/register-owner")}
            className="font-medium text-blue-600"
          >
            Mua gói ngay
          </button>
        </div>
      </form>
    </div>
  );
}