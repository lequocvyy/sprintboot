import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ProductModal from '@/features/products/components/ProductModal'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useWarehouses } from '@/features/warehouses/hooks/useWarehouses'
import StockTransactionForm from '../components/StockTransactionForm'
import {
  useStockIn,
  useStockOut,
  useTransactions,
} from '../hooks/useTransactions'
import type {
  StockTransaction,
  StockTransactionRequest,
} from '@/types/transaction'
import { useAuthStore } from '@/features/auth/store/authStore'

const PAGE_SIZE = 10

export default function TransactionsPage() {
  const user = useAuthStore((s) => s.user)

  const canStockIn =
    user?.role === 'SHOP_OWNER' || user?.role === 'SHOP_MANAGER'

  const canStockOut =
    user?.role === 'SHOP_OWNER' ||
    user?.role === 'SHOP_MANAGER' ||
    user?.role === 'SHOP_STAFF'

  const { data: transactions = [], isLoading, isError, error } =
    useTransactions()

  const { data: products = [] } = useProducts()
  const { data: warehouses = [] } = useWarehouses()

  const stockInMutation = useStockIn()
  const stockOutMutation = useStockOut()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [openIn, setOpenIn] = useState(false)
  const [openOut, setOpenOut] = useState(false)

  const activeWarehouses = useMemo(
    () => warehouses.filter((warehouse) => warehouse.status === 'ACTIVE'),
    [warehouses],
  )

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesKeyword =
        !keyword ||
        transaction.productName.toLowerCase().includes(keyword) ||
        transaction.warehouseName.toLowerCase().includes(keyword) ||
        (transaction.reference || '').toLowerCase().includes(keyword) ||
        (transaction.note || '').toLowerCase().includes(keyword) ||
        (transaction.createdByUsername || '').toLowerCase().includes(keyword) ||
        (transaction.createdByRole || '').toLowerCase().includes(keyword)

      const matchesType = !typeFilter || transaction.type === typeFilter

      return matchesKeyword && matchesType
    })
  }, [transactions, search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredTransactions.slice(start, end)
  }, [filteredTransactions, page])

  const getErrorMessage = (err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as any).response === 'object'
    ) {
      return (
        (err as any).response?.data?.message ||
        (err as any).response?.data?.error ||
        'Có lỗi xảy ra'
      )
    }

    return 'Có lỗi xảy ra'
  }

  const handleStockIn = async (data: StockTransactionRequest) => {
    try {
      await stockInMutation.mutateAsync(data)
      toast.success('Nhập kho thành công')
      setOpenIn(false)
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Nhập kho thất bại')
    }
  }

  const handleStockOut = async (data: StockTransactionRequest) => {
    try {
      await stockOutMutation.mutateAsync(data)
      toast.success('Xuất kho thành công')
      setOpenOut(false)
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Xuất kho thất bại')
    }
  }

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  const renderTypeBadge = (type: StockTransaction['type']) => {
    if (type === 'IN') {
      return (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          IN
        </span>
      )
    }

    if (type === 'OUT') {
      return (
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
          OUT
        </span>
      )
    }

    return (
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {type}
      </span>
    )
  }

  const renderRoleBadge = (role?: string) => {
    if (!role) return '-'

    if (role === 'SHOP_OWNER') {
      return (
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
          SHOP_OWNER
        </span>
      )
    }

    if (role === 'SHOP_MANAGER') {
      return (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          SHOP_MANAGER
        </span>
      )
    }

    if (role === 'SHOP_STAFF') {
      return (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          SHOP_STAFF
        </span>
      )
    }

    return (
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {role}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">
            Quản lý lịch sử nhập kho và xuất kho
          </p>
        </div>

        <div className="flex gap-2">
          {canStockIn && (
            <button
              onClick={() => setOpenIn(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              + Nhập kho
            </button>
          )}

          {canStockOut && (
            <button
              onClick={() => setOpenOut(true)}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              - Xuất kho
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Tìm theo sản phẩm, kho, reference, note, người thao tác..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-56"
            >
              <option value="">Tất cả loại</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="ADJUSTMENT">ADJUSTMENT</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Tổng: <span className="font-semibold">{filteredTransactions.length}</span>{' '}
            giao dịch
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="py-10 text-center text-red-600">
            Tải danh sách giao dịch thất bại
            <div className="mt-2 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Chưa có giao dịch nào
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Sản phẩm
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Loại
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Số lượng
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Người thao tác
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Vai trò
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Reference
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Note
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.id}
                      </td>
                      <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
                        {transaction.productName}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.warehouseName}
                      </td>
                      <td className="border-b px-4 py-3 text-sm">
                        {renderTypeBadge(transaction.type)}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.quantity}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.createdByUsername || '-'}
                      </td>
                      <td className="border-b px-4 py-3 text-sm">
                        {renderRoleBadge(transaction.createdByRole)}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.reference || '-'}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {transaction.note || '-'}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ProductModal
        open={openIn}
        onClose={() => setOpenIn(false)}
        title="Nhập kho"
      >
        <StockTransactionForm
          type="IN"
          products={products}
          warehouses={activeWarehouses}
          loading={stockInMutation.isPending}
          onSubmit={handleStockIn}
          onCancel={() => setOpenIn(false)}
        />
      </ProductModal>

      <ProductModal
        open={openOut}
        onClose={() => setOpenOut(false)}
        title="Xuất kho"
      >
        <StockTransactionForm
          type="OUT"
          products={products}
          warehouses={activeWarehouses}
          loading={stockOutMutation.isPending}
          onSubmit={handleStockOut}
          onCancel={() => setOpenOut(false)}
        />
      </ProductModal>
    </div>
  )
}