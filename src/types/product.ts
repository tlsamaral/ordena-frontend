import type { Category } from './category'

export type ProductList = Product[]

export interface Product {
  id: string
  name: string
  price: string
  description: string
  banner: string
  created_at: Date | null
  updated_at: Date | null
  category_id: string
  category: string
}
