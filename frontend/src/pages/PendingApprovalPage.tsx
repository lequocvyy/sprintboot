import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
      <div className="w-full rounded-3xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
          ⏳
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Tài khoản chờ duyệt
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          Hồ sơ shop của bạn đã được gửi thành công và đang chờ admin xử lý.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          Thời gian duyệt trung bình: <strong>15 phút</strong>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Sau khi được duyệt, bạn chỉ cần đăng nhập lại để vào dashboard shop.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
          >
            Kiểm tra lại
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}