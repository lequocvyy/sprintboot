export type Product = {
  id: number
  name: string
  sku: string
  price: number
}

export type ProductCreateRequest = {
  name: string
  sku: string
  price: number
}

export type ProductUpdateRequest = {
  name: string
  sku: string
  price: number
}