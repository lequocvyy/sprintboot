import { useState } from 'react'

type Props = {
  mode: 'increase' | 'decrease'
  loading?: boolean
  onSubmit: (quantity: number) => void
  onCancel: () => void
}

export default function StockAdjustmentForm({
  mode,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (quantity === '' || Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Số lượng phải lớn hơn 0')
      return
    }

    setError('')
    onSubmit(Number(quantity))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {mode === 'increase' ? 'Số lượng tăng' : 'Số lượng giảm'}
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="VD: 10"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
          {loading
            ? 'Đang xử lý...'
            : mode === 'increase'
            ? 'Tăng tồn'
            : 'Giảm tồn'}
        </button>
      </div>
    </form>
  )
}