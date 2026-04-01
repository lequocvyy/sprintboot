export type Warehouse = {
  id: number
  code: string
  name: string
  address?: string
  status: string
}

export type WarehouseCreateRequest = {
  code: string
  name: string
  address?: string
}

export type WarehouseUpdateRequest = {
  name: string
  address?: string
}