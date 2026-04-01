export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'CANCELLED'

export type OrderItem = {
  id: number
  productId: number
  productName: string
  productSku: string
  quantity: number
  price: number
}

export type Order = {
  id: number
  orderCode: string
  customerName: string
  status: OrderStatus
  warehouseId: number
  createdAt: string
  totalAmount: number
  items: OrderItem[]
}

export type CreateOrderItemRequest = {
  productId: number
  quantity: number
  price: number
}

export type CreateOrderRequest = {
  customerName: string
  warehouseId: number
  items: CreateOrderItemRequest[]
}