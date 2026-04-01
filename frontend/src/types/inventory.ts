export type Inventory = {
  id: number
  productId: number
  productName: string
  productSku: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  quantity: number
}

export type InventoryCreateRequest = {
  productId: number
  warehouseId: number
  quantity: number
}

export type IncreaseStockRequest = {
  productId: number
  warehouseId: number
  quantity: number
}

export type DecreaseStockRequest = {
  productId: number
  warehouseId: number
  quantity: number
}