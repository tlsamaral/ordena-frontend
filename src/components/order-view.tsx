import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Order, OrderTypes } from '@/types/order'
import { Button } from './ui/button'

interface OrderViewProps {
  order: Order
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function OrderView({ order, open, setOpen }: OrderViewProps) {
  function handleStatusChange(status: OrderTypes) {
    if (status === 'P') {
      console.log('Processando', order.id)
    } else if (status === 'A') {
      console.log('Aberto', status)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Pedido da mesa de {order.name}</DialogTitle>
          <DialogDescription>
            A mesa {order.name} fez o pedido #{order.id}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button>Finalizar pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
