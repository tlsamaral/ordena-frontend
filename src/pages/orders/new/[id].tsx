import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { setupAPIClient } from '@/services/api'
import type { OrderById, OrderResponse } from '@/types/order'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface NewOrderPageProps {
  orderDetails: OrderById | null
}
export default function NewOrderPage({ orderDetails }: NewOrderPageProps) {
  if (orderDetails === null) {
    return notFound()
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Novo pedido</CardTitle>
          <CardDescription>
            Nesta seção voce pode adicionar um pedido
          </CardDescription>
        </CardHeader>
        <CardContent>{orderDetails.id}</CardContent>
      </Card>
    </main>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.query

  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get<OrderById>(`/order/${id}`)

  return {
    props: {
      orderDetails: response.data,
    },
  }
})
