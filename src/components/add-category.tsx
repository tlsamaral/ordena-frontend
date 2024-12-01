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
import { ToastAction } from '@/components/ui/toast'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/services/apiClient'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import { CheckCircle, PlusCircle, Upload } from 'lucide-react'
import { type ChangeEvent, useContext, useEffect, useState } from 'react'
import { SearchCategory } from './search-category'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function AddCategory() {
	const [name, setName] = useState('')

	const { toast } = useToast()
	const { setCategories } = useContext(GlobalContext)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name) {
			return
		}
		try {
			const response = await api.post<Category>('/category', { name })
			console.log(response)

			toast({
				title: 'Categoria cadastrada com sucesso!',
				description: `A categoria "${response.data.name}" foi adicionada.`,
				action: <ToastAction altText="Desfazer ação">Desfazer</ToastAction>,
			})
		} catch (error) {
			console.error('Erro ao cadastrar o produto:', error)
			toast({
				title: 'Erro ao cadastrar a categoria',
				description:
					'Ocorreu um erro ao tentar cadastrar a categoria. Tente novamente.',
				variant: 'destructive',
				action: (
					<ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>
				),
			})
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" className="h-8 gap-1">
					<PlusCircle className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Nova categoria
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[350px] sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Adionar Categoria</DialogTitle>
					<DialogDescription>Preencha esta categoria.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="col-span-3"
								placeholder="Nome da categoria"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" size="sm">
							Salvar categoria{' '}
							<CheckCircle size={16} className="text-sm ml-2" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
