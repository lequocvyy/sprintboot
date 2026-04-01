import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ProductModal from '@/features/products/components/ProductModal'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useWarehouses } from '@/features/warehouses/hooks/useWarehouses'
import CreateInventoryForm from '../components/CreateInventoryForm'
import StockAdjustmentForm from '../components/StockAdjustmentForm'
import {
  useCreateInventory,
  useDecreaseStock,
  useIncreaseStock,
  useInventories,
} from '../hooks/useInventory'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Inventory, InventoryCreateRequest } from '@/types/inventory'

const PAGE_SIZE = 10

export default function InventoryPage() {
  const user = useAuthStore((s) => s.user)

  const canManage =
    user?.role === 'SHOP_OWNER' || user?.role === 'SHOP_MANAGER'

  const {
    data: inventories = [],
    isLoading,
    isError,
    error,
  } = useInventories()

  const { data: products = [] } = useProducts()
  const { data: warehouses = [] } = useWarehouses()

  const createMutation = useCreateInventory()
  const increaseMutation = useIncreaseStock()
  const decreaseMutation = useDecreaseStock()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [increaseTarget, setIncreaseTarget] = useState<Inventory | null>(null)
  const [decreaseTarget, setDecreaseTarget] = useState<Inventory | null>(null)

  const activeWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => warehouse.status === 'ACTIVE')
  }, [warehouses])

  const filteredInventories = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return inventories.filter((inventory) => {
      const matchesKeyword =
        !keyword ||
        inventory.productName.toLowerCase().includes(keyword) ||
        inventory.productSku.toLowerCase().includes(keyword) ||
        inventory.warehouseName.toLowerCase().includes(keyword) ||
        inventory.warehouseCode.toLowerCase().includes(keyword)

      const matchesWarehouse =
        !warehouseFilter || String(inventory.warehouseId) === warehouseFilter

      return matchesKeyword && matchesWarehouse
    })
  }, [inventories, search, warehouseFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventories.length / PAGE_SIZE),
  )

  const paginatedInventories = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredInventories.slice(start, end)
  }, [filteredInventories, page])

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

  const handleCreate = async (data: InventoryCreateRequest) => {
    try {
      await createMutation.mutateAsync(data)
      setCreateOpen(false)
      toast.success('Tạo inventory thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err))
    }
  }

  const handleIncrease = async (quantity: number) => {
    if (!increaseTarget) return

    try {
      await increaseMutation.mutateAsync({
        productId: increaseTarget.productId,
        warehouseId: increaseTarget.warehouseId,
        quantity,
      })
      setIncreaseTarget(null)
      toast.success('Tăng tồn thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err))
    }
  }

  const handleDecrease = async (quantity: number) => {
    if (!decreaseTarget) return

    try {
      await decreaseMutation.mutateAsync({
        productId: decreaseTarget.productId,
        warehouseId: decreaseTarget.warehouseId,
        quantity,
      })
      setDecreaseTarget(null)
      toast.success('Giảm tồn thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err))
    }
  }

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">
            Quản lý tồn kho theo sản phẩm và kho
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Tạo inventory
          </button>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Tìm theo sản phẩm, SKU, kho..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />

            <select
              value={warehouseFilter}
              onChange={(e) => {
                setWarehouseFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-64"
            >
              <option value="">Tất cả kho</option>
              {activeWarehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Tổng: <span className="font-semibold">{filteredInventories.length}</span>{' '}
            inventory
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-red-600">
            Tải danh sách inventory thất bại
            <div className="mt-2 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        ) : filteredInventories.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Không có inventory nào
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
                      SKU
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Mã kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Số lượng
                    </th>
                    <th className="border-b px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedInventories.map((inventory) => (
                    <tr key={inventory.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {inventory.id}
                      </td>
                      <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
                        {inventory.productName}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {inventory.productSku}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {inventory.warehouseName}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {inventory.warehouseCode}
                      </td>
                      <td className="border-b px-4 py-3 text-sm">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {inventory.quantity}
                        </span>
                      </td>
                      <td className="border-b px-4 py-3 text-right text-sm">
                        {canManage && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setIncreaseTarget(inventory)}
                              className="rounded-lg border border-green-200 px-3 py-1.5 text-green-600 hover:bg-green-50"
                            >
                              + Tăng
                            </button>

                            <button
                              onClick={() => setDecreaseTarget(inventory)}
                              className="rounded-lg border border-orange-200 px-3 py-1.5 text-orange-600 hover:bg-orange-50"
                            >
                              - Giảm
                            </button>
                          </div>
                        )}
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
        open={createOpen}
        title="Tạo inventory mới"
        onClose={() => setCreateOpen(false)}
      >
        <CreateInventoryForm
          products={products}
          warehouses={activeWarehouses}
          loading={createMutation.isPending}
          onSubmit={(data) => handleCreate(data as InventoryCreateRequest)}
          onCancel={() => setCreateOpen(false)}
        />
      </ProductModal>

      <ProductModal
        open={!!increaseTarget}
        title="Tăng tồn kho"
        onClose={() => setIncreaseTarget(null)}
      >
        <StockAdjustmentForm
          mode="increase"
          loading={increaseMutation.isPending}
          onSubmit={handleIncrease}
          onCancel={() => setIncreaseTarget(null)}
        />
      </ProductModal>

      <ProductModal
        open={!!decreaseTarget}
        title="Giảm tồn kho"
        onClose={() => setDecreaseTarget(null)}
      >
        <StockAdjustmentForm
          mode="decrease"
          loading={decreaseMutation.isPending}
          onSubmit={handleDecrease}
          onCancel={() => setDecreaseTarget(null)}
        />
      </ProductModal>
    </div>
  )
}