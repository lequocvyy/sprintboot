import { useEffect, useState } from "react";
import { shopApi, type ShopItem } from "../api/shopApi";

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchShops = async () => {
    try {
      setErrorMsg("");
      setLoading(true);
      const data = await shopApi.getAllShops();
      setShops(data);
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.message || "Không tải được danh sách shop"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shops</h1>
            <p className="mt-2 text-sm text-slate-500">
              Danh sách tất cả shop đã được tạo trên hệ thống
            </p>
          </div>

          <button
            onClick={fetchShops}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
          Loading shops...
        </div>
      )}

      {!!errorMsg && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">All Shops</h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    #{shop.id}
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {shop.code}
                  </td>
                  <td className="px-6 py-4 text-slate-800">{shop.name}</td>
                  <td className="px-6 py-4 text-slate-500">{shop.slug}</td>
                  <td className="px-6 py-4 text-slate-500">{shop.address || "-"}</td>
                  <td className="px-6 py-4">
                    {shop.active ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        INACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {shops.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    Chưa có shop nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}