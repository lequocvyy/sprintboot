import StatusBadge from "@/components/common/StatusBadge";
import { useApproveShopRequest, useShopRequests } from "../hooks/useShopRequests";
import { getShopRequestTone } from "../utils";

export default function ShopRequestsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useShopRequests();
  const approveMutation = useApproveShopRequest();

  const handleApprove = (id: number, shopName: string) => {
    const confirmed = window.confirm(`Approve request for "${shopName}"?`);

    if (!confirmed) return;

    approveMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shop Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Duyệt các yêu cầu tạo shop đang chờ xử lý.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading shop requests...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          Không tải được danh sách shop requests.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Danh sách yêu cầu tạo shop
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Shop Name</th>
                  <th className="px-5 py-3 font-semibold">Slug</th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Requested By</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {data?.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {item.shopName}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.shopSlug}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.address || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.requestedByUsername}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        label={item.status}
                        tone={getShopRequestTone(item.status)}
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleApprove(item.id, item.shopName)}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-green-600 px-4 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? "Processing..." : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}

                {data?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <div className="text-sm font-medium text-slate-500">
                        Không có pending request nào.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}