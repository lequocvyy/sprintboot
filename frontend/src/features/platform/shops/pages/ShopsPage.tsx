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
      setErrorMsg(error?.response?.data?.message || "Không tải được danh sách shop");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shops</h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách tất cả shop đã được tạo trên hệ thống.
          </p>
        </div>

        <button
          onClick={fetchShops}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
          Loading shops...
        </div>
      )}

      {!!errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-t">
                  <td className="p-3 font-medium">{shop.id}</td>
                  <td className="p-3 text-slate-700">{shop.code}</td>
                  <td className="p-3 text-slate-700">{shop.name}</td>
                  <td className="p-3 text-slate-600">{shop.slug}</td>
                  <td className="p-3 text-slate-600">{shop.address || "-"}</td>
                  <td className="p-3">
                    {shop.active ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        INACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {shops.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
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