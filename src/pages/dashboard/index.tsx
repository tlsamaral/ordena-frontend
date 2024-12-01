import { Aside } from '@/components/aside'
import { Badge } from '@/components/ui/badge'
import {
	ChevronLeft,
	ChevronRight,
	Copy,
	CreditCard,
	File,
	ListFilter,
	MoreVertical,
	Truck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

import { OrderPreview } from '@/components/order-preview'
import { OrdersViewTable } from '@/components/orders-view-table'
import { setupAPIClient } from '@/services/api'
import type { Order } from '@/types/order'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { formatCurrency, formatValueToMoney } from '@/utils/formatCurrency'
import Link from 'next/link'
import { useState } from 'react'

export const description =
	'An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.'

interface DashboardProps {
	orders: Order[]
}

export default function Dashboard({ orders }: DashboardProps) {
	const [orderPreview, setOrderPreview] = useState<Order | null>(
		orders[0] || null,
	)
	const newOrders = orders.length
	const valueToday = orders.reduce((acc, order) => {
		return order.items.reduce(
			(acc, item) => acc + item.amount * Number(item.product.price),
			acc,
		)
	}, 0)

	function handleOrderPreview(order: Order) {
		setOrderPreview(order)
	}

	function handleNextOrder() {
		if (!orderPreview) return
		const index = orders.findIndex((order) => order.id === orderPreview.id)
		if (index < orders.length - 1) {
			setOrderPreview(orders[index + 1])
		}
	}

	function handlePreviousOrder() {
		if (!orderPreview) return
		const index = orders.findIndex((order) => order.id === orderPreview.id)
		if (index > 0) {
			setOrderPreview(orders[index - 1])
		}
	}

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
			<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
					<Card
						className="sm:col-span-2 max-w-full overflow-hidden"
						x-chunk="dashboard-05-chunk-0"
					>
						<CardHeader className="pb-3">
							<CardTitle>Seus pedidos</CardTitle>
							<CardDescription className="max-w-lg text-balance leading-relaxed">
								Explore o Nosso Painel Dinâmico de Pedidos para Gerenciar com
								Facilidade e Obter Insights Valiosos.
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Button asChild>
								<Link href="/orders?new_order_base=true">
									Criar novo pedido
								</Link>
							</Button>
						</CardFooter>
					</Card>
					<Card
						x-chunk="dashboard-05-chunk-1"
						className="max-w-full overflow-hidden"
					>
						<CardHeader className="pb-2">
							<CardDescription>Pedidos abertos</CardDescription>
							<CardTitle className="text-lg sm:text-2xl md:text-4xl">
								+{newOrders}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xs text-muted-foreground">
								+25% em relação a ontem
							</div>
						</CardContent>
						<CardFooter>
							<Progress value={25} aria-label="25% increase" />
						</CardFooter>
					</Card>
					<Card
						x-chunk="dashboard-05-chunk-2"
						className="md:col-span-3 lg:col-span-1 max-w-full overflow-hidden"
					>
						<CardHeader className="pb-2">
							<CardDescription>Faturamento</CardDescription>
							<CardTitle className="text-lg sm:text-2xl md:text-4xl">
								{formatValueToMoney(valueToday)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xs text-muted-foreground">
								Soma de todas as vendas abertas
							</div>
						</CardContent>
						<CardFooter>
							<Progress value={12} aria-label="12% increase" />
						</CardFooter>
					</Card>
				</div>
				<OrdersViewTable
					orders={orders}
					onOrderPreview={handleOrderPreview}
					orderPreview={orderPreview}
				/>
			</div>
			<OrderPreview
				order={orderPreview}
				onNextOrder={handleNextOrder}
				onPreviousOrder={handlePreviousOrder}
			/>
		</main>
	)
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
	try {
		const apiClient = setupAPIClient(ctx)
		const response = await apiClient.get<Order[]>('/orders')

		return {
			props: {
				orders: response.data,
			},
		}
	} catch (error) {
		return {
			props: {
				orders: [],
			},
		}
	}
})
