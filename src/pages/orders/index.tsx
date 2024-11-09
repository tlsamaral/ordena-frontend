import { OrdersTable } from '@/components/orders-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { setupAPIClient } from '@/services/api'
import type { Order } from '@/types/order'
import { canSSRAuth } from '@/utils/canSSRAuth'

interface OrdersPageProps {
  orders: Order[]
}
export default function OrdersPage({ orders }: OrdersPageProps) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Novo pedido</CardTitle>
          <CardDescription>
            Nesta seção voce pode adicionar um pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </main>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get<Order[]>('/orders')

  return {
    props: {
      orders: response.data,
    },
  }
})
