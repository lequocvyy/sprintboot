import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useWarehouses } from '@/features/warehouses/hooks/useWarehouses'
import { useInventories } from '@/features/inventory/hooks/useInventory'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  useCancelOrder,
  useConfirmOrder,
  useCreateOrder,
  useDeleteOrder,
  useOrders,
} from '../hooks/useOrders'
import type { CreateOrderRequest, Order, OrderStatus } from '@/types/order'

const PAGE_SIZE = 10

type DraftItem = {
  productId: number
  quantity: number
  price: number
}

const emptyDraftItem: DraftItem = {
  productId: 0,
  quantity: 1,
  price: 0,
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object'
  ) {
    return (
      (error as any).response?.data?.message ||
      (error as any).response?.data?.error ||
      'Có lỗi xảy ra'
    )
  }

  if (error instanceof Error) return error.message
  return 'Có lỗi xảy ra'
}

function statusBadge(status: OrderStatus) {
  if (status === 'CREATED') {
    return 'bg-blue-100 text-blue-700'
  }
  if (status === 'CONFIRMED') {
    return 'bg-green-100 text-green-700'
  }
  return 'bg-slate-100 text-slate-700'
}

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const canDelete =
    user?.role === 'SHOP_OWNER' || user?.role === 'SHOP_MANAGER'

  const { data: orders = [], isLoading, isError, error } = useOrders()
  const { data: products = [] } = useProducts()
  const { data: warehouses = [] } = useWarehouses()
  const { data: inventories = [] } = useInventories()

  const createOrderMutation = useCreateOrder()
  const confirmOrderMutation = useConfirmOrder()
  const cancelOrderMutation = useCancelOrder()
  const deleteOrderMutation = useDeleteOrder()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openCreate, setOpenCreate] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [warehouseId, setWarehouseId] = useState<number>(0)
  const [items, setItems] = useState<DraftItem[]>([{ ...emptyDraftItem }])

  const activeWarehouses = useMemo(
    () => warehouses.filter((warehouse) => warehouse.status === 'ACTIVE'),
    [warehouses]
  )

  const warehouseNameById = useMemo(() => {
    const map = new Map<number, string>()
    warehouses.forEach((warehouse) => {
      map.set(warehouse.id, warehouse.name)
    })
    return map
  }, [warehouses])

  const availableInventories = useMemo(() => {
    if (!warehouseId) return []

    return inventories.filter(
      (inventory) =>
        inventory.warehouseId === warehouseId && inventory.quantity > 0
    )
  }, [inventories, warehouseId])

  const availableProducts = useMemo(() => {
    const availableProductIds = new Set(
      availableInventories.map((inventory) => inventory.productId)
    )

    return products.filter((product) => availableProductIds.has(product.id))
  }, [products, availableInventories])

  const stockByProductId = useMemo(() => {
    const map = new Map<number, number>()

    availableInventories.forEach((inventory) => {
      map.set(inventory.productId, inventory.quantity)
    })

    return map
  }, [availableInventories])

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesKeyword =
        !keyword ||
        order.orderCode.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword)

      const matchesStatus = !statusFilter || order.status === statusFilter

      return matchesKeyword && matchesStatus
    })
  }, [orders, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredOrders.slice(start, start + PAGE_SIZE)
  }, [filteredOrders, page])

  const resetForm = () => {
    setCustomerName('')
    setWarehouseId(0)
    setItems([{ ...emptyDraftItem }])
  }

  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyDraftItem }])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (
    index: number,
    field: keyof DraftItem,
    value: number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId)

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              price: product?.price ?? item.price,
              quantity: 1,
            }
          : item
      )
    )
  }

  const handleWarehouseChange = (nextWarehouseId: number) => {
    setWarehouseId(nextWarehouseId)
    setItems([{ ...emptyDraftItem }])
  }

  const handleCreateOrder = async () => {
    const validItems = items.filter(
      (item) => item.productId > 0 && item.quantity > 0 && item.price >= 0
    )

    if (!customerName.trim()) {
      toast.error('Vui lòng nhập tên khách hàng')
      return
    }

    if (!warehouseId) {
      toast.error('Vui lòng chọn kho')
      return
    }

    if (validItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 sản phẩm')
      return
    }

    const duplicatedProductIds = new Set<number>()
    const seenProductIds = new Set<number>()

    for (const item of validItems) {
      if (seenProductIds.has(item.productId)) {
        duplicatedProductIds.add(item.productId)
      }
      seenProductIds.add(item.productId)
    }

    if (duplicatedProductIds.size > 0) {
      toast.error('Không được chọn trùng sản phẩm trong cùng một đơn')
      return
    }

    const invalidItem = validItems.find((item) => {
      const stock = stockByProductId.get(item.productId) ?? 0
      return item.quantity > stock
    })

    if (invalidItem) {
      toast.error('Có sản phẩm vượt quá tồn kho của kho đã chọn')
      return
    }

    const payload: CreateOrderRequest = {
      customerName: customerName.trim(),
      warehouseId,
      items: validItems,
    }

    try {
      await createOrderMutation.mutateAsync(payload)
      toast.success('Tạo đơn hàng thành công')
      setOpenCreate(false)
      resetForm()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirm = async (order: Order) => {
    try {
      await confirmOrderMutation.mutateAsync(order.id)
      toast.success(`Đã xác nhận đơn ${order.orderCode}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleCancel = async (order: Order) => {
    try {
      await cancelOrderMutation.mutateAsync(order.id)
      toast.success(`Đã hủy đơn ${order.orderCode}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (order: Order) => {
    try {
      await deleteOrderMutation.mutateAsync(order.id)
      toast.success(`Đã xóa đơn ${order.orderCode}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            Quản lý đơn bán hàng của shop
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Tạo đơn hàng
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-56"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="CREATED">CREATED</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Tổng: <span className="font-semibold">{filteredOrders.length}</span>{' '}
            đơn
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="py-10 text-center text-red-600">
            Tải danh sách đơn hàng thất bại
            <div className="mt-2 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Chưa có đơn hàng nào</div>
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
                      Mã đơn
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Khách hàng
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Số item
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tổng tiền
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                    
    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
      Chi tiết
    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

               <tbody>
  {paginatedOrders.map((order) => {
    const isExpanded = expandedOrderId === order.id

    return (
      <>
        <tr key={order.id} className="hover:bg-gray-50">
          <td className="border-b px-4 py-3 text-sm text-gray-700">
            {order.id}
          </td>
          <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
            {order.orderCode}
          </td>
          <td className="border-b px-4 py-3 text-sm text-gray-700">
            {order.customerName}
          </td>
          <td className="border-b px-4 py-3 text-sm text-gray-700">
            {warehouseNameById.get(order.warehouseId) ?? `#${order.warehouseId}`}
          </td>
          <td className="border-b px-4 py-3 text-sm">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </td>
          <td className="border-b px-4 py-3 text-sm text-gray-700">
            {order.items.length}
          </td>
          <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
            {(order.totalAmount ?? 0).toLocaleString('vi-VN')} đ
          </td>
          <td className="border-b px-4 py-3 text-sm text-gray-700">
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </td>
          <td className="border-b px-4 py-3 text-sm">
            <button
              onClick={() =>
                setExpandedOrderId(isExpanded ? null : order.id)
              }
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {isExpanded ? 'Ẩn items' : 'Xem items'}
            </button>
          </td>
          <td className="border-b px-4 py-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {order.status === 'CREATED' && (
                <>
                  <button
                    onClick={() => handleConfirm(order)}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleCancel(order)}
                    className="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </>
              )}

              {canDelete && order.status !== 'CONFIRMED' && (
                <button
                  onClick={() => handleDelete(order)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </td>
        </tr>

        {isExpanded && (
          <tr>
            <td colSpan={10} className="border-b bg-slate-50 px-4 py-4">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-800">
                  Chi tiết sản phẩm
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Sản phẩm
                        </th>
                        <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          SKU
                        </th>
                        <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Số lượng
                        </th>
                        <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Đơn giá
                        </th>
                        <th className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="border-b px-4 py-3 text-sm font-medium text-slate-900">
                            {item.productName}
                          </td>
                          <td className="border-b px-4 py-3 text-sm text-slate-600">
                            {item.productSku}
                          </td>
                          <td className="border-b px-4 py-3 text-sm text-slate-600">
                            {item.quantity}
                          </td>
                          <td className="border-b px-4 py-3 text-sm text-slate-600">
                            {item.price.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="border-b px-4 py-3 text-sm font-medium text-slate-900">
                            {(item.quantity * item.price).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                    Tổng đơn: {(order.totalAmount ?? 0).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    )
  })}
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

      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Tạo đơn hàng</h2>
              <button
                onClick={() => {
                  setOpenCreate(false)
                  resetForm()
                }}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Khách hàng
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kho
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => handleWarehouseChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value={0}>Chọn kho</option>
                  {activeWarehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                <button
                  onClick={addItem}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  + Thêm item
                </button>
              </div>

              {items.map((item, index) => {
                const stock = stockByProductId.get(item.productId) ?? 0

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4"
                  >
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          handleProductChange(index, Number(e.target.value))
                        }
                        disabled={!warehouseId}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100"
                      >
                        <option value={0}>
                          {!warehouseId ? 'Chọn kho trước' : 'Chọn sản phẩm'}
                        </option>
                        {availableProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - tồn:{' '}
                            {stockByProductId.get(product.id) ?? 0}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={item.productId ? stock : undefined}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      />
                      {item.productId > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          Tồn kho hiện tại: {stock}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Price
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, 'price', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenCreate(false)
                  resetForm()
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createOrderMutation.isPending ? 'Đang tạo...' : 'Tạo đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}