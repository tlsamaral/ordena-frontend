import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlobalContext } from '@/contexts/GlobalContext'
import { api } from '@/services/apiClient'
import type { Table } from '@/types/table'
import { CheckCircle, PlusCircle } from 'lucide-react'
import { useContext, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export function AddTable() {
	const { setTables } = useContext(GlobalContext)
	const [name, setName] = useState('')
	const [open, setOpen] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const response = await api.post<Table>('/tables', {
				name,
			})
			setTables((prev) => [...prev, response.data])
			setOpen(false)

			toast('Mesa cadastrada', {
				description: 'Agora você tem uma nova mesa disponível.',
				icon: <CheckCircle size={14} className="text-green-500" />,
			})
		} catch (error) {
			console.error('Erro ao cadastrar o usuário:', error)
			toast('Erro ao cadastrar o usuário', {
				description:
					'Ocorreu um erro ao tentar cadastrar o usuário. Tente novamente.',
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="h-8 gap-1">
					<PlusCircle className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Adicionar Mesa
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[350px] sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Adicionar mesa</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para adicionar uma nova mesa.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Nome
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="col-span-3"
								placeholder="Nome da mesa"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" size="sm">
							Adicionar <CheckCircle size={16} className="text-sm ml-2" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
