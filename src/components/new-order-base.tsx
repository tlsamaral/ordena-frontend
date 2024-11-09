import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAllTables } from '@/data/get-tables'
import { api } from '@/services/apiClient'
import type { OrderResponse } from '@/types/order'
import type { TableList } from '@/types/table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const NewOrderSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  table_id: z.string().uuid('É necessário selecionar uma mesa'),
})

export default function NewOrderBase() {
  const router = useRouter()
  const [tables, setTables] = useState<TableList>([])
  const [orderName, setOrderName] = useState('')
  const [orderTable, setOrderTable] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllTables()
        setTables(response)
      } catch (error) {
        console.error(error)
      }
    }
    getData()
  }, [])

  const handleNewOrder = async () => {
    try {
      const validated = NewOrderSchema.safeParse({
        name: orderName,
        table_id: orderTable,
      })

      if (!validated.success) {
        toast('Erro ao abrir pedido', {
          description:
            validated.error.issues[0].message || 'Erro ao abrir pedido',
        })
        return
      }
      setIsLoading(true)
      const response = await api.post<OrderResponse>('/order', {
        name: orderName,
        table_id: orderTable,
      })

      const data = {
        id: response.data.id,
        name: response.data.name,
        table_name: response.data.table.name,
      }

      const query = {
        dataOrder: encodeURIComponent(JSON.stringify(data)),
      }
      router.push({
        pathname: '/orders/new',
        query: query,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Novo Pedido</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo pedido</DialogTitle>
          <DialogDescription>
            Para criar um novo pedido, preencha os campos abaixo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Digite o nome"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
            />
          </div>
          <div>
            <Label>Mesa</Label>
            <Select value={orderTable} onValueChange={setOrderTable}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a mesa.." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Selecione a mesa</SelectLabel>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="h-9 w-full"
            onClick={handleNewOrder}
            disabled={isLoading}
          >
            {isLoading ? 'Abrindo pedido...' : 'Abrir pedido'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
