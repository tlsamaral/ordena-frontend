import { OrdersTable } from '@/components/orders-table'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { GlobalContext } from '@/contexts/GlobalContext'
import { setupAPIClient } from '@/services/api'
import { initializeSocket } from '@/services/socket/socket'
import type { Order } from '@/types/order'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { useContext, useEffect, useRef, useState } from 'react'
import { set } from 'zod'

interface OrdersPageProps {
	orders: Order[]
}

export default function OrdersPage({ orders }: OrdersPageProps) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const { realTimeOrders, setRealTimeOrders } = useContext(GlobalContext)

	useEffect(() => {
		setRealTimeOrders(orders)
		// Inicializa o áudio apenas no lado do cliente
		audioRef.current = new Audio('/order-complete.mp3')

		const socket = initializeSocket()

		const handleOrderCompleted = (newOrder: Order) => {
			setRealTimeOrders((prevOrders) => [newOrder, ...prevOrders])

			if (audioRef.current) {
				audioRef.current.play()
			}
		}

		const updateOrder = (order: Order) => {
			setRealTimeOrders((prevOrders) => {
				const orderExists = prevOrders.some(
					(prevOrder) => prevOrder.id === order.id,
				)

				if (orderExists) {
					return prevOrders.map((prevOrder) =>
						prevOrder.id === order.id ? order : prevOrder,
					)
				}

				return [...prevOrders, order]
			})

			if (audioRef.current) {
				audioRef.current.play()
			}
		}

		function removeOrderByList(order: Order) {
			setRealTimeOrders((prevOrders) =>
				prevOrders.filter((prevOrder) => prevOrder.id !== order.id),
			)
		}

		socket.on('connect', () => {
			console.log('Connected to WebSocket server')
		})

		socket.on('orderCompleted', handleOrderCompleted)

		socket.on('order:process', updateOrder)

		socket.on('order:end', removeOrderByList)

		return () => {
			socket.off('orderCompleted', handleOrderCompleted)
			socket.off('order:process', updateOrder)
			socket.off('order:end', removeOrderByList)
			console.log('Disconnected from WebSocket server')
		}
	}, [setRealTimeOrders, orders])

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Card
				x-chunk="dashboard-06-chunk-0"
				className="max-w-full overflow-hidden"
			>
				<CardHeader>
					<CardTitle>Novo pedido</CardTitle>
					<CardDescription>
						Nesta seção você pode adicionar um pedido
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OrdersTable orders={realTimeOrders} />
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
