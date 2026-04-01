export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT'

export interface DashboardRecentTransaction {
  id: number
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  type: TransactionType
  quantity: number
  reference: string | null
  note: string | null
  createdByUsername: string | null
  createdByRole: string | null
  createdAt: string
}

export interface LowStockAlert {
  inventoryId: number
  productId: number
  productName: string
  productSku: string
  warehouseId: number
  warehouseName: string
  warehouseCode: string
  quantity: number
}

export interface ShopDashboardSummaryResponse {
  totalProducts: number
  totalActiveWarehouses: number
  totalStock: number
  todayTransactionCount: number
  recentTransactions: DashboardRecentTransaction[]
  lowStockAlerts: LowStockAlert[]

}

export interface DashboardDailyTransactionPoint {
  date: string
  transactionCount: number
  stockInQuantity: number
  stockOutQuantity: number
}

export interface DashboardChartResponse {
  dailyTransactions: DashboardDailyTransactionPoint[]
}