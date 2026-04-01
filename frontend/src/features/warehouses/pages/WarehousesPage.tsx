import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ProductModal from '@/features/products/components/ProductModal'
import WarehouseForm from '../components/WarehouseForm'
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useUpdateWarehouse,
  useWarehouses,
} from '../hooks/useWarehouses'
import type {
  Warehouse,
  WarehouseCreateRequest,
  WarehouseUpdateRequest,
} from '@/types/warehouse'
import { useAuthStore } from '@/features/auth/store/authStore'

const PAGE_SIZE = 10

export default function WarehousesPage() {
  const user = useAuthStore((s) => s.user)

  const canCreate = user?.role === 'SHOP_OWNER' || user?.role === 'SHOP_MANAGER'
  const canEdit = canCreate
  const canDelete = user?.role === 'SHOP_OWNER'

  const { data: warehouses = [], isLoading, isError, error } = useWarehouses()
  const createMutation = useCreateWarehouse()
  const updateMutation = useUpdateWarehouse()
  const deleteMutation = useDeleteWarehouse()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)

  const filteredWarehouses = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return warehouses

    return warehouses.filter(
      (warehouse) =>
        warehouse.code.toLowerCase().includes(keyword) ||
        warehouse.name.toLowerCase().includes(keyword) ||
        (warehouse.address || '').toLowerCase().includes(keyword),
    )
  }, [warehouses, search])

  const totalPages = Math.max(1, Math.ceil(filteredWarehouses.length / PAGE_SIZE))

  const paginatedWarehouses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredWarehouses.slice(start, end)
  }, [filteredWarehouses, page])

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

  const handleCreate = async (data: WarehouseCreateRequest) => {
    try {
      await createMutation.mutateAsync(data)
      setCreateOpen(false)
      toast.success('Tạo kho thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Tạo kho thất bại')
    }
  }

  const handleUpdate = async (data: WarehouseUpdateRequest) => {
    if (!editingWarehouse) return

    try {
      await updateMutation.mutateAsync({
        id: editingWarehouse.id,
        payload: data,
      })
      setEditingWarehouse(null)
      toast.success('Cập nhật kho thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Cập nhật kho thất bại')
    }
  }

  const handleDelete = async (warehouse: Warehouse) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa kho "${warehouse.name}" không?`,
    )
    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync(warehouse.id)
      toast.success('Xóa kho thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Xóa kho thất bại')
    }
  }

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-sm text-gray-500">Quản lý danh sách kho hàng</p>
        </div>

        {canCreate && (
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Tạo kho
          </button>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Tìm theo mã kho, tên kho, địa chỉ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          <div className="text-sm text-gray-500">
            Tổng: <span className="font-semibold">{filteredWarehouses.length}</span>{' '}
            kho
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="py-10 text-center text-red-600">
            Tải danh sách kho thất bại
            <div className="mt-2 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Không có kho nào</div>
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
                      Mã kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tên kho
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Địa chỉ
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="border-b px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedWarehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {warehouse.id}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {warehouse.code}
                      </td>
                      <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
                        {warehouse.name}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {warehouse.address || '-'}
                      </td>
                      <td className="border-b px-4 py-3 text-sm">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          {warehouse.status}
                        </span>
                      </td>
                      <td className="border-b px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => setEditingWarehouse(warehouse)}
                              className="rounded-lg border border-blue-200 px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                            >
                              Sửa
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => handleDelete(warehouse)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
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
        title="Tạo kho mới"
        onClose={() => setCreateOpen(false)}
      >
        <WarehouseForm
          loading={createMutation.isPending}
          onSubmit={(data) => handleCreate(data as WarehouseCreateRequest)}
          onCancel={() => setCreateOpen(false)}
        />
      </ProductModal>

      <ProductModal
        open={!!editingWarehouse}
        title="Cập nhật kho"
        onClose={() => setEditingWarehouse(null)}
      >
        {editingWarehouse && (
          <WarehouseForm
            initialData={editingWarehouse}
            loading={updateMutation.isPending}
            onSubmit={(data) => handleUpdate(data as WarehouseUpdateRequest)}
            onCancel={() => setEditingWarehouse(null)}
          />
        )}
      </ProductModal>
    </div>
  )
}