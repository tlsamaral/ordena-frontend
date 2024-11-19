import type { OrderTypes } from '@/types/order'

export function getOrderStatusName(status: OrderTypes) {
  switch (status) {
    case 'P':
      return 'Em preparo'
    case 'F':
      return 'Finalizado'
    case 'C':
      return 'Cancelado'

    case 'A':
      return 'Aberto'
    default:
      return ''
  }
}
