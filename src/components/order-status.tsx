import type { OrderTypes } from '@/types/order'

export function orderStatusColor(status: OrderTypes) {
  switch (status) {
    case 'P':
      return 'bg-yellow-500'
    case 'F':
      return 'bg-green-500'
    case 'C':
      return 'bg-red-500'
    case 'A':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}
interface OrderStatusProps {
  orderStatus: OrderTypes
}
export function OrderStatus({ orderStatus }: OrderStatusProps) {
  const getOrderStatusColor = orderStatusColor(orderStatus)
  return (
    <div
      className={`w-3 h-3 rounded-full animate-pulse ${getOrderStatusColor}`}
    />
  )
}
