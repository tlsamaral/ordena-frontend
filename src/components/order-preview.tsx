import type { Order } from '@/types/order'
import { formatValueToMoney } from '@/utils/formatCurrency'
import { format } from 'date-fns'
import {
	ChevronLeft,
	ChevronRight,
	Copy,
	CreditCard,
	MoreVertical,
	Truck,
} from 'lucide-react'
import { Button } from './ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationItem } from './ui/pagination'
import { Separator } from './ui/separator'

interface OrderPreviewProps {
	order: Order
	onNextOrder: () => void
	onPreviousOrder: () => void
}
export function OrderPreview({
	order,
	onNextOrder,
	onPreviousOrder,
}: OrderPreviewProps) {
	const orderTotal = order.items.reduce((acc, item) => {
		return acc + item.amount * Number(item.product.price)
	}, 0)
	return (
		<div>
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-4 text-lg">
							Pedido #{order.id}
							<Button
								size="icon"
								variant="outline"
								className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<Copy className="h-3 w-3" />
								<span className="sr-only">Copy Order ID</span>
							</Button>
						</CardTitle>
						<CardDescription>
							Data:{' '}
							{order.created_at
								? format(new Date(order.created_at), "dd 'de' LLL yyyy")
								: ''}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="p-6 text-sm">
					<div className="grid gap-3">
						<div className="font-semibold">Detalhes do pedido</div>
						<ul className="grid gap-3">
							{order.items.map((item) => (
								<li className="flex items-center justify-between" key={item.id}>
									<span className="text-muted-foreground">
										{item.product.name} <span>{item.amount}</span>
									</span>
									<span>
										{formatValueToMoney(
											Number(item.product.price) * item.amount,
										)}
									</span>
								</li>
							))}
						</ul>
						<Separator className="my-2" />
						<ul className="grid gap-3">
							<li className="flex items-center justify-between font-semibold">
								<span className="text-muted-foreground">Total</span>
								<span>{formatValueToMoney(orderTotal)}</span>
							</li>
						</ul>
					</div>
					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Informações do pedido</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Nome</dt>
								<dd>{order.name}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Telefone</dt>
								<dd>
									<a href="tel:">{order.phone ?? 'Não informado'}</a>
								</dd>
							</div>
						</dl>
					</div>
				</CardContent>
				<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
					<div className="text-xs text-muted-foreground">
						{order.updated_at ? (
							<>
								{' '}
								Atualizado em{' '}
								<time dateTime={new Date(order.updated_at).toISOString()}>
									{format(new Date(order.updated_at), "dd 'de' LLL yyyy")}
								</time>
							</>
						) : (
							''
						)}
					</div>
					<Pagination className="ml-auto mr-0 w-auto">
						<PaginationContent>
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="h-6 w-6"
									onClick={() => onPreviousOrder()}
								>
									<ChevronLeft className="h-3.5 w-3.5" />
									<span className="sr-only">Previous Order</span>
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="h-6 w-6"
									onClick={() => onNextOrder()}
								>
									<ChevronRight className="h-3.5 w-3.5" />
									<span className="sr-only">Next Order</span>
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</CardFooter>
			</Card>
		</div>
	)
}
