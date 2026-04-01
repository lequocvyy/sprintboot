export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT'

export type StockTransaction = {
  id: number
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  type: TransactionType
  quantity: number
  reference?: string
  note?: string
  createdByUsername?: string
  createdByRole?: string
  createdAt: string
}

export type StockTransactionRequest = {
  productId: number
  warehouseId: number
  quantity: number
  reference?: string
  note?: string
}