import { useEffect, useState } from 'react'
import type {
  Warehouse,
  WarehouseCreateRequest,
  WarehouseUpdateRequest,
} from '@/types/warehouse'

type WarehouseFormProps = {
  initialData?: Warehouse | null
  loading?: boolean
  onSubmit: (data: WarehouseCreateRequest | WarehouseUpdateRequest) => void
  onCancel: () => void
}

type FormErrors = {
  code?: string
  name?: string
  address?: string
}

export default function WarehouseForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: WarehouseFormProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code)
      setName(initialData.name)
      setAddress(initialData.address || '')
    } else {
      setCode('')
      setName('')
      setAddress('')
    }
  }, [initialData])

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!initialData && !code.trim()) {
      nextErrors.code = 'Mã kho không được để trống'
    }

    if (!name.trim()) {
      nextErrors.name = 'Tên kho không được để trống'
    }

    if (address.length > 255) {
      nextErrors.address = 'Địa chỉ không được quá 255 ký tự'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    if (initialData) {
      onSubmit({
        name: name.trim(),
        address: address.trim(),
      })
      return
    }

    onSubmit({
      code: code.trim(),
      name: name.trim(),
      address: address.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!initialData && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mã kho
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="VD: WH-HCM"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
          )}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tên kho
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: Kho Hồ Chí Minh"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: Quận 1, TP.HCM"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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