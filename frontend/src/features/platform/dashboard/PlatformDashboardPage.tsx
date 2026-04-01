import { Link } from "react-router-dom";
import { useShopRequests } from "@/features/platform/shop-requests/hooks/useShopRequests";

export default function PlatformDashboardPage() {
  const { data, isLoading } = useShopRequests();

  const pendingCount = data?.length ?? 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-7 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Platform Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">
          Tổng quan vận hành phía platform.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Pending Shop Requests
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {isLoading ? "..." : pendingCount}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Pending
            </div>
          </div>

          <Link
            to="/platform/shop-requests"
            className="mt-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View requests
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Approved Today
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                -
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Today
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Total Shops
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                -
              </div>
            </div>

            <div className="rounded-xl bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              System
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}