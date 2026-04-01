import { useMemo, useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductModal from '../components/ProductModal'
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '../hooks/useProducts'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

const PAGE_SIZE = 10

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error } = useProducts()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword),
    )
  }, [products, search])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredProducts.slice(start, end)
  }, [filteredProducts, page])

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

  const handleCreate = async (data: {
    name: string
    sku: string
    price: number
  }) => {
    try {
      await createMutation.mutateAsync(data)
      setCreateOpen(false)
      toast.success('Tạo sản phẩm thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Tạo sản phẩm thất bại')
    }
  }

  const handleUpdate = async (data: {
    name: string
    sku: string
    price: number
  }) => {
    if (!editingProduct) return

    try {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        payload: data,
      })
      setEditingProduct(null)
      toast.success('Cập nhật sản phẩm thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Cập nhật sản phẩm thất bại')
    }
  }

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`,
    )
    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync(product.id)
      toast.success('Xóa sản phẩm thành công')
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err) || 'Xóa sản phẩm thất bại')
    }
  }

  const goPrev = () => setPage((prev) => Math.max(1, prev - 1))
  const goNext = () => setPage((prev) => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Quản lý danh sách sản phẩm của shop
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Tạo sản phẩm
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          <div className="text-sm text-gray-500">
            Tổng: <span className="font-semibold">{filteredProducts.length}</span>{' '}
            sản phẩm
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="py-10 text-center text-red-600">
            Tải danh sách sản phẩm thất bại
            <div className="mt-2 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Không có sản phẩm nào
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
                      Tên sản phẩm
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      SKU
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Giá
                    </th>
                    <th className="border-b px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {product.id}
                      </td>
                      <td className="border-b px-4 py-3 text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {product.sku}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-700">
                        {product.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="border-b px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50"
                          >
                            Xóa
                          </button>
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
        title="Tạo sản phẩm mới"
        onClose={() => setCreateOpen(false)}
      >
        <ProductForm
          loading={createMutation.isPending}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </ProductModal>

      <ProductModal
        open={!!editingProduct}
        title="Cập nhật sản phẩm"
        onClose={() => setEditingProduct(null)}
      >
        <ProductForm
          initialData={editingProduct}
          loading={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      </ProductModal>
    </div>
  )
}