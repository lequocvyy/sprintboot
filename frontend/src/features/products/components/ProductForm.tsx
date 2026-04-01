import { useEffect, useState } from 'react'
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
} from '@/types/product'

type ProductFormProps = {
  initialData?: Product | null
  loading?: boolean
  onSubmit: (data: ProductCreateRequest | ProductUpdateRequest) => void
  onCancel: () => void
}

type FormErrors = {
  name?: string
  sku?: string
  price?: string
}

export default function ProductForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSku(initialData.sku)
      setPrice(String(initialData.price))
    } else {
      setName('')
      setSku('')
      setPrice('')
    }
  }, [initialData])

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!name.trim()) {
      nextErrors.name = 'Tên sản phẩm không được để trống'
    }

    if (!sku.trim()) {
      nextErrors.sku = 'SKU không được để trống'
    }

    if (!price.trim()) {
      nextErrors.price = 'Giá không được để trống'
    } else if (Number(price) <= 0 || Number.isNaN(Number(price))) {
      nextErrors.price = 'Giá phải lớn hơn 0'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    onSubmit({
      name: name.trim(),
      sku: sku.trim(),
      price: Number(price),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tên sản phẩm
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: Coca Cola 330ml"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: COKE-330"
        />
        {errors.sku && (
          <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Giá
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: 12000"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
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
          {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </div>
    </form>
  )
}