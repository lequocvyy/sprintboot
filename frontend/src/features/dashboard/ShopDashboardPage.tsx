import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardSummary'
import { useDashboardChart } from '@/features/dashboard/hooks/useDashboardChart'
import type {
  DashboardDailyTransactionPoint,
  DashboardRecentTransaction,
  LowStockAlert,
} from '@/types/dashboard'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('vi-VN')
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatShortDate(value: string) {
  const date = new Date(value)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

function getTransactionLabel(type: 'IN' | 'OUT' | 'ADJUSTMENT') {
  switch (type) {
    case 'IN':
      return 'Nhập'
    case 'OUT':
      return 'Xuất'
    case 'ADJUSTMENT':
      return 'Điều chỉnh'
    default:
      return type
  }
}

function StatCard({
  title,
  value,
}: {
  title: string
  value: number | string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
      </div>
    </div>
  )
}

export default function ShopDashboardPage() {
  const lowStockThreshold = 10

  const summaryQuery = useDashboardSummary({
    recentLimit: 8,
    lowStockThreshold,
    lowStockLimit: 8,
  })

  const chartQuery = useDashboardChart({
    days: 7,
  })

  const isLoading = summaryQuery.isLoading || chartQuery.isLoading
  const isError = summaryQuery.isError || chartQuery.isError

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    const message =
      (summaryQuery.error as Error | null)?.message ||
      (chartQuery.error as Error | null)?.message ||
      'Unknown error'

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shop Dashboard</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p>Không tải được dashboard.</p>
          <p className="mt-1 text-sm">{message}</p>
          <button
            onClick={() => {
              summaryQuery.refetch()
              chartQuery.refetch()
            }}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  const summary = summaryQuery.data
  const chart = chartQuery.data

  if (!summary || !chart) {
    return null
  }

  const lineChartData = chart.dailyTransactions.map(
    (item: DashboardDailyTransactionPoint) => ({
      ...item,
      label: formatShortDate(item.date),
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shop Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Tổng quan nhanh tình hình sản phẩm, kho và giao dịch 7 ngày gần nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tổng số sản phẩm"
          value={formatNumber(summary.totalProducts)}
        />
        <StatCard
          title="Tổng số kho (ACTIVE)"
          value={formatNumber(summary.totalActiveWarehouses)}
        />
        <StatCard
          title="Tổng tồn kho"
          value={formatNumber(summary.totalStock)}
        />
        <StatCard
          title="Giao dịch hôm nay"
          value={formatNumber(summary.todayTransactionCount)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Số giao dịch 7 ngày gần nhất
            </h2>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transactionCount"
                  name="Số giao dịch"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Nhập / Xuất kho 7 ngày gần nhất
            </h2>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockInQuantity" name="Nhập kho" />
                <Bar dataKey="stockOutQuantity" name="Xuất kho" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent transactions
            </h2>
            <span className="text-sm text-slate-500">
              {formatNumber(summary.recentTransactions.length)} bản ghi
            </span>
          </div>

          {summary.recentTransactions.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có giao dịch nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="pb-3 pr-4">Thời gian</th>
                    <th className="pb-3 pr-4">Sản phẩm</th>
                    <th className="pb-3 pr-4">Kho</th>
                    <th className="pb-3 pr-4">Loại</th>
                    <th className="pb-3 pr-4">SL</th>
                    <th className="pb-3 pr-4">Người tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentTransactions.map(
                    (tx: DashboardRecentTransaction) => (
                      <tr key={tx.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 text-slate-700">
                          {formatDateTime(tx.createdAt)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-slate-900">
                            {tx.productName}
                          </div>
                          {tx.reference && (
                            <div className="text-xs text-slate-500">
                              Ref: {tx.reference}
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {tx.warehouseName}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              tx.type === 'IN'
                                ? 'bg-green-100 text-green-700'
                                : tx.type === 'OUT'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {getTransactionLabel(tx.type)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {formatNumber(tx.quantity)}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          <div>{tx.createdByUsername || '-'}</div>
                          <div className="text-xs text-slate-500">
                            {tx.createdByRole || '-'}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Low stock alert
            </h2>
            <span className="text-sm text-slate-500">
              ngưỡng ≤ {formatNumber(lowStockThreshold)}
            </span>
          </div>

          {summary.lowStockAlerts.length === 0 ? (
            <p className="text-sm text-slate-500">
              Không có sản phẩm sắp hết hàng.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.lowStockAlerts.map((item: LowStockAlert) => (
                <div
                  key={item.inventoryId}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        SKU: {item.productSku || '-'}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Kho: {item.warehouseName} ({item.warehouseCode})
                      </p>
                    </div>

                    <div className="rounded-lg bg-white px-3 py-2 text-right shadow-sm">
                      <div className="text-xs text-slate-500">Tồn kho</div>
                      <div className="text-lg font-bold text-amber-700">
                        {formatNumber(item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}