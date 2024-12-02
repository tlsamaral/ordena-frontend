import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { initializeSocket } from '@/services/socket/socket'
import type { Order } from '@/types/order'
import { formatValueToMoney } from '@/utils/formatCurrency'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { TextApp } from './text-app'
export function FinishOrder() {
	const [open, setOpen] = useState(false)
	const [order, setOrder] = useState<Order | null>(null)
	const finishOrder = useRef<HTMLAudioElement | null>(null)
	useEffect(() => {
		const socket = initializeSocket() // Inicia a conexão Socket.io

		finishOrder.current = new Audio('/finish-order.mp3')
		socket.on('order:finish', (order: Order) => {
			console.log('Evento order:update recebido:', order) // Log de diagnóstico
			setOrder(order)
			setOpen(true)
			if (finishOrder.current) {
				finishOrder.current.play()
			}
			toast(`O pedido ${order.name} está pronto!`) // Exibe a notificação com o nome do pedido
		})

		console.log('Conectando ao socket...')

		return () => {
			console.log('Desconectando o socket...')
			socket.off('order:finish') // Remove o ouvinte para evitar duplicações
			socket.disconnect() // Desconecta o socket ao desmontar o componente
		}
	}, [])

	if (!order) {
		return null
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Pedido pronto</DialogTitle>
					<DialogDescription>
						O pedido foi preparado e pronto para ser entregue.
					</DialogDescription>
				</DialogHeader>
				<div>
					<TextApp className="block text-base font-semibold">
						Nome: {order.name}
					</TextApp>
					<TextApp className="block text-base font-semibold my-3">
						Mesa: {order.table.name}
					</TextApp>
					{order.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-2 brightness-90 border rounded-lg p-2"
						>
							<img
								className="h-11 w-12 rounded-lg"
								src={item.product.banner}
								alt={`product/${item.product.name}`}
							/>
							<div>
								<span className="block text-sm">{item.product.name}</span>
								<small>Quantidade: {item.amount}</small>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
