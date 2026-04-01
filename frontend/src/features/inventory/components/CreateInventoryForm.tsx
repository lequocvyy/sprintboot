import { useState } from 'react'
import type { InventoryCreateRequest } from '@/types/inventory'
import type { Product } from '@/types/product'
import type { Warehouse } from '@/types/warehouse'

type Props = {
  products: Product[]
  warehouses: Warehouse[]
  loading?: boolean
  onSubmit: (data: InventoryCreateRequest) => void
  onCancel: () => void
}

export default function CreateInventoryForm({
  products,
  warehouses,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [productId, setProductId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [quantity, setQuantity] = useState('0')

  const [errors, setErrors] = useState<{
    productId?: string
    warehouseId?: string
    quantity?: string
  }>({})

  const validate = () => {
    const nextErrors: {
      productId?: string
      warehouseId?: string
      quantity?: string
    } = {}

    if (!productId) {
      nextErrors.productId = 'Vui lòng chọn sản phẩm'
    }

    if (!warehouseId) {
      nextErrors.warehouseId = 'Vui lòng chọn kho'
    }

    if (quantity === '' || Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
      nextErrors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    onSubmit({
      productId: Number(productId),
      warehouseId: Number(warehouseId),
      quantity: Number(quantity),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Sản phẩm
        </label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Kho
        </label>
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="">-- Chọn kho --</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name} ({warehouse.code})
            </option>
          ))}
        </select>
        {errors.warehouseId && (
          <p className="mt-1 text-sm text-red-600">{errors.warehouseId}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Số lượng ban đầu
        </label>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: 100"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Tạo mới'}
        </button>
      </div>
    </form>
  )
}