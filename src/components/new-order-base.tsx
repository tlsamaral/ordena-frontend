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
import { formatPhoneNumber } from '@/utils/formaPhoneNumber'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const NewOrderSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	table_id: z.string().uuid('É necessário selecionar uma mesa'),
})

export default function NewOrderBase() {
	const router = useRouter()
	const [tables, setTables] = useState<TableList>([])
	const [orderName, setOrderName] = useState('')
	const [orderPhone, setOrderPhone] = useState('')
	const [orderTable, setOrderTable] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

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

	// Abrir modal ao detectar parâmetro `new_order_base` na URL
	useEffect(() => {
		if (router.query.new_order_base === 'true') {
			setIsDialogOpen(true)
		}
	}, [router.query])

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formattedPhone = formatPhoneNumber(e.target.value)
		setOrderPhone(formattedPhone)
	}

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
				phone: orderPhone.replace(/\D/g, ''),
			})

			const data = {
				id: response.data.id,
				name: response.data.name,
				table_name: response.data.table.name,
			}

			router.push({
				pathname: `/orders/new/${data.id}`,
			})
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleOpenDialog = () => {
		setIsDialogOpen(true)
		router.push('?new_order_base=true', undefined, { shallow: true })
	}

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		router.push(router.pathname, undefined, { shallow: true })
	}

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(open) => (open ? handleOpenDialog() : handleCloseDialog())}
		>
			<DialogTrigger asChild>
				<Button onClick={handleOpenDialog}>Novo Pedido</Button>
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
							placeholder="Digite o nome.."
							value={orderName}
							onChange={(e) => setOrderName(e.target.value)}
						/>
					</div>
					<div>
						<Label>Telefone</Label>
						<Input
							type="text"
							placeholder="Digite o telefone.."
							value={orderPhone}
							onChange={handlePhoneChange}
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
						className="h-9 w-full  dark:bg-orange-500 dark:text-gray-100 dark:hover:bg-orange-400"
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
