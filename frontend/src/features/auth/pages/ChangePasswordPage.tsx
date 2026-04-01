import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (user) {
        setUser({
          ...user,
          passwordChanged: true,
        });
      }

      if (user?.shopId) {
        navigate("/app/dashboard", { replace: true });
        return;
      }

      if (user?.shopRequestStatus === "PENDING") {
        navigate("/pending-approval", { replace: true });
        return;
      }

      navigate("/app/shop-request", { replace: true });
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Đổi mật khẩu lần đầu</h1>
      <p className="mb-6 text-sm text-slate-500">
        Bạn đang dùng mật khẩu tạm được gửi qua email. Vui lòng đổi sang mật khẩu mới để tiếp tục.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu tạm từ email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
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
          {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}