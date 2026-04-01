import { useState } from 'react'
import type { Product } from '@/types/product'
import type { Warehouse } from '@/types/warehouse'
import type { StockTransactionRequest } from '@/types/transaction'

type Props = {
  type: 'IN' | 'OUT'
  products: Product[]
  warehouses: Warehouse[]
  loading?: boolean
  onSubmit: (data: StockTransactionRequest) => void
  onCancel: () => void
}

type FormErrors = {
  productId?: string
  warehouseId?: string
  quantity?: string
  reference?: string
  note?: string
}

export default function StockTransactionForm({
  type,
  products,
  warehouses,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [productId, setProductId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [reference, setReference] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!productId) {
      nextErrors.productId = 'Vui lòng chọn sản phẩm'
    }

    if (!warehouseId) {
      nextErrors.warehouseId = 'Vui lòng chọn kho'
    }

    if (
      quantity === '' ||
      Number.isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      nextErrors.quantity = 'Số lượng phải lớn hơn 0'
    }

    if (reference.length > 100) {
      nextErrors.reference = 'Reference không được quá 100 ký tự'
    }

    if (note.length > 255) {
      nextErrors.note = 'Note không được quá 255 ký tự'
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
      reference: reference.trim() || undefined,
      note: note.trim() || undefined,
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
          Số lượng {type === 'IN' ? 'nhập' : 'xuất'}
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: 10"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Reference
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: IMPORT-001"
        />
        {errors.reference && (
          <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Ghi chú"
          rows={3}
        />
        {errors.note && (
          <p className="mt-1 text-sm text-red-600">{errors.note}</p>
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
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
            type === 'IN'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {loading
            ? 'Đang xử lý...'
            : type === 'IN'
            ? 'Nhập kho'
            : 'Xuất kho'}
        </button>
      </div>
    </form>
  )
}