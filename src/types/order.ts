export type OrderTypes = 'A' | 'C' | 'F' | 'P'
export interface Order {
  id: string
  table_id: string
  status: OrderTypes
  phone: string | null
  draft: boolean
  name: string | null
  created_at: Date | null
  updated_at: Date | null
  items: Item[]
  table: {
    name: string
  }
}

export interface Item {
  amount: number
  created_at: Date | null
  id: string
  order_id: string
  product_id: string
  updated_at: Date | null
  product: ProductInfo
}

export interface ProductInfo {
  name: string
  banner: string
  price: string
}

export interface OrderResponse {
  id: string
  table: Table
  name: string
}

export interface Table {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface OrderById {
  id: string
  table_id: string
  status: boolean
  draft: boolean
  name: string
  created_at: string
  updated_at: string
  table: Table
}

export interface ProductOrder {
  id: string
  name: string
  price: number
  amount: number
}
