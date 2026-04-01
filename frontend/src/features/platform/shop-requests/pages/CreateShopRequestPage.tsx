import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopRequestApi } from "../api/shopRequestApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function CreateShopRequestPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [shopName, setShopName] = useState("");
  const [shopSlug, setShopSlug] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await shopRequestApi.createRequest({
        shopName,
        shopSlug,
        address,
      });

      if (user) {
        setUser({
          ...user,
          shopRequestStatus: "PENDING",
        });
      }

      navigate("/pending-approval", { replace: true });
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Nộp hồ sơ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Nộp hồ sơ shop</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sau khi admin duyệt, shop sẽ được tạo và gán vào tài khoản của bạn.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên shop</label>
          <input
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Vy Store"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Shop slug</label>
          <input
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={shopSlug}
            onChange={(e) => setShopSlug(e.target.value)}
            placeholder="vy-store"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
          <input
            className="w-full rounded-xl border px-4 py-2 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Hồ Chí Minh"
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
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Nộp hồ sơ"}
        </button>
      </form>
    </div>
  );
}