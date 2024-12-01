import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { Order } from '@/types/order'
import { formatValueToMoney } from '@/utils/formatCurrency'
import { formatDistance } from '@/utils/formatDistanceToNow'
import { getOrderStatusName } from '@/utils/getOrderStatusName'
import { File, ListFilter } from 'lucide-react'
import { OrderStatus } from './order-status'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface OrdersViewTableProps {
	orders: Order[]
	onOrderPreview: (order: Order) => void
	orderPreview: Order | null
}
export function OrdersViewTable({
	orders,
	onOrderPreview,
	orderPreview,
}: OrdersViewTableProps) {
	const ordersOpened = orders.filter((order) => order.status === 'A')
	const ordersInPreparation = orders.filter((order) => order.status === 'P')
	return (
		<Tabs defaultValue="all">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="all">Todos</TabsTrigger>
					<TabsTrigger value="opened">Abertos</TabsTrigger>
					<TabsTrigger value="in-preparation">Em preparo</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="all">
				<Card
					x-chunk="dashboard-05-chunk-3"
					className="max-w-full overflow-hidden"
				>
					<CardHeader className="px-7">
						<CardTitle>Todos os pedidos</CardTitle>
						<CardDescription>Todos os pedidos</CardDescription>
					</CardHeader>
					<CardContent>
						<OrderTable
							orders={orders}
							onOrderPreview={onOrderPreview}
							orderSelected={orderPreview}
						/>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="opened">
				<Card
					x-chunk="dashboard-05-chunk-3"
					className="max-w-full overflow-hidden"
				>
					<CardHeader className="px-7">
						<CardTitle>Pedidos em aberto</CardTitle>
						<CardDescription>
							Pedidos que estão em aberto, aguardando o preparo
						</CardDescription>
					</CardHeader>
					<CardContent>
						<OrderTable
							orders={ordersOpened}
							onOrderPreview={onOrderPreview}
							orderSelected={orderPreview}
						/>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="in-preparation">
				<Card x-chunk="dashboard-05-chunk-3" className="max-w-full">
					<CardHeader className="px-7">
						<CardTitle>Pedidos sendo preparados</CardTitle>
						<CardDescription>
							Pedidos que estão sendo preparados
						</CardDescription>
					</CardHeader>
					<CardContent>
						<OrderTable
							orders={ordersInPreparation}
							onOrderPreview={onOrderPreview}
							orderSelected={orderPreview}
						/>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}

interface OrderTableProps {
	orders: Order[]
	onOrderPreview: (order: Order) => void
	orderSelected: Order | null
}
function OrderTable({
	orders,
	onOrderPreview,
	orderSelected,
}: OrderTableProps) {
	return (
		<div className="overflow-x-auto">
			<Table className="w-full min-w-[600px]">
				<TableHeader>
					<TableRow>
						<TableHead>Cliente</TableHead>
						<TableHead className="sm:table-cell">Mesa</TableHead>
						<TableHead className="sm:table-cell w-[120px]">Status</TableHead>
						<TableHead className="md:table-cell">Abertura do pedido</TableHead>
						<TableHead className="sm:table-cell">Valor do pedido</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((order) => {
						const orderValue = order.items.reduce((acc, item) => {
							return acc + Number(item.product.price) * item.amount
						}, 0)
						return (
							<TableRow
								key={order.id}
								onClick={() => onOrderPreview(order)}
								className={order.id === orderSelected?.id ? 'bg-muted' : ''}
							>
								<TableCell>{order.name}</TableCell>
								<TableCell className="sm:table-cell">
									{order.table.name}
								</TableCell>
								<TableCell className="flex items-center gap-2">
									<OrderStatus orderStatus={order.status} />{' '}
									{getOrderStatusName(order.status)}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{order.created_at !== null
										? formatDistance(order.created_at)
										: ''}
								</TableCell>
								<TableCell>{formatValueToMoney(orderValue)}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
