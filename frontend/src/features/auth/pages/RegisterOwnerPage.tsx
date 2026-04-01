import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  authApi,
  type SubscriptionPackageResponse,
} from "@/features/auth/api/authApi";

export default function RegisterOwnerPage() {
  const location = useLocation();

  const [packages, setPackages] = useState<SubscriptionPackageResponse[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [packageCode, setPackageCode] = useState(
    location.state?.selectedPackage || "TRIAL_7D"
  );

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await authApi.getPackages();
        setPackages(data);
      } catch {
        setErrorMsg("Không tải được danh sách gói");
      } finally {
        setPageLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await authApi.registerOwner({
        fullName,
        email,
        packageCode,
      });

      setSuccessMsg(
        res.message || "Tạo tài khoản thành công. Vui lòng kiểm tra email."
      );
      setFullName("");
      setEmail("");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Mua gói và tạo tài khoản</h1>
      <p className="mb-6 text-sm text-slate-500">
        Sau khi thanh toán thành công, hệ thống sẽ tạo tài khoản Shop Owner và
        gửi thông tin đăng nhập qua email.
      </p>

      {pageLoading ? (
        <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Đang tải danh sách gói...
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium">Họ và tên</label>
            <input
              className="w-full rounded-xl border px-4 py-2 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Fullname(ex: Lê Quốc Vỹ): "
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (ex: abc@gmail.com): "
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Gói dịch vụ</label>
            <select
              className="w-full rounded-xl border px-4 py-2 outline-none"
              value={packageCode}
              onChange={(e) => setPackageCode(e.target.value)}
            >
              {packages.map((pkg) => (
                <option key={pkg.code} value={pkg.code}>
                  {pkg.name} - {pkg.price.toLocaleString("vi-VN")} đ
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Đang xử lý..." : "Thanh toán và tạo tài khoản"}
          </button>

          <div className="text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-medium text-blue-600">
              Đăng nhập
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}