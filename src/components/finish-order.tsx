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
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
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
        <div>O pedido número {order.id}</div>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
