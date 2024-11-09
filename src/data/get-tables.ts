import { api } from '@/services/apiClient'
import type { TableList } from '@/types/table'

export const getAllTables = async () => {
  try {
    const response = await api.get<TableList>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tables`,
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
