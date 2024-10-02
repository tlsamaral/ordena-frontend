export interface Order {
  id: string
  table: number
  status: boolean
  draft: boolean
  name: string | null
  created_at: Date | null
  updated_at: Date | null
}
