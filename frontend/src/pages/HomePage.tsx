import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  authApi,
  type SubscriptionPackageResponse,
} from "@/features/auth/api/authApi";

export default function HomePage() {
  const [packages, setPackages] = useState<SubscriptionPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await authApi.getPackages();
        setPackages(data);
      } catch {
        setError("Không tải được danh sách gói. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const featuredPackageCode = useMemo(() => {
    if (!packages.length) return "";
    const sorted = [...packages].sort((a, b) => b.price - a.price);
    return sorted[Math.floor(sorted.length / 2)]?.code || packages[0]?.code || "";
  }, [packages]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl shadow-lg">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('https://i.ibb.co/zWQh5YmP/image.png')",
    }}
  />

  {/* Overlay đen cho dễ đọc chữ */}
  <div className="absolute inset-0 bg-black/60" />

  {/* Content */}
  <div className="relative z-10 px-8 py-12 text-white lg:px-14 lg:py-16">
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      
      {/* LEFT */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
          Nền tảng quản lý inventory cho shop
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
          Bắt đầu vận hành shop bài bản với Inventory SaaS
        </h1>

        <p className="mt-6 text-base leading-7 text-slate-200 lg:text-lg">
          Chọn gói dịch vụ phù hợp, thanh toán thành công để hệ thống tự tạo
          tài khoản Shop Owner và gửi thông tin đăng nhập qua email.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            to="/register-owner"
            className="rounded-xl border border-white/30 px-6 py-3 text-sm text-white-white transition hover:bg-white/20"
          >
            Chọn gói ngay
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white/30 px-6 py-3 text-sm text-white"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="hidden lg:block">
        <div className="rounded-2xl bg-white/90 p-6 text-slate-900 backdrop-blur">
          <h3 className="text-lg font-semibold text-blue-600">
            Quy trình bắt đầu
          </h3>

          <div className="mt-4 space-y-3">
            {[
              "Chọn gói dịch vụ phù hợp",
              "Thanh toán và nhận tài khoản qua email",
              "Đăng nhập và nộp hồ sơ shop",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 rounded-xl border p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                  {i + 1}
                </div>
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

        <section className="mt-14">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Bảng giá
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Các gói dịch vụ
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Chọn gói phù hợp để bắt đầu sử dụng hệ thống quản lý shop.
              </p>
            </div>

            {!loading && !error && packages.length > 0 && (
              <div className="text-sm text-slate-500">
                Có{" "}
                <span className="font-semibold text-slate-900">
                  {packages.length}
                </span>{" "}
                gói đang mở bán
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="mt-4 h-7 w-40 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-24 rounded bg-slate-100" />
                  <div className="mt-8 h-10 w-32 rounded bg-slate-200" />
                  <div className="mt-6 space-y-3">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                    <div className="h-4 w-4/6 rounded bg-slate-100" />
                  </div>
                  <div className="mt-8 h-11 w-full rounded-xl bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-red-700">
                    Có lỗi xảy ra
                  </h3>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Tải lại trang
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {packages.map((pkg) => {
                const isFeatured = pkg.code === featuredPackageCode;

                return (
                  <div
                    key={pkg.code}
                    className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      isFeatured
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        Phổ biến
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Gói dịch vụ
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                          {pkg.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Mã gói: {pkg.code}
                        </p>
                      </div>

                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {pkg.durationDays} ngày
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                          {pkg.price.toLocaleString("vi-VN")}
                        </span>
                        <span className="pb-1 text-sm text-slate-500">đ</span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Thanh toán một lần để kích hoạt tài khoản owner.
                      </p>
                    </div>

                    <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Kích hoạt tài khoản Shop Owner</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Gửi thông tin đăng nhập qua email</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Sử dụng trong {pkg.durationDays} ngày</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        to="/register-owner"
                        state={{ selectedPackage: pkg.code }}
                        className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                          isFeatured
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        Chọn gói này
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}