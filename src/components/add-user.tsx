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
import { useToast } from '@/hooks/use-toast'
import { api } from '@/services/apiClient'
import { CheckCircle, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'

export function AddUser() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const { toast } = useToast()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			await api.post('/users', {
				name,
				email,
				password: '123456',
				isAdmin,
			})

			toast({
				title: 'Usuário cadastrado com sucesso!',
				description: `O usuário "${name}" foi adicionado.`,
				action: <ToastAction altText="Desfazer ação">Desfazer</ToastAction>,
			})
		} catch (error) {
			console.error('Erro ao cadastrar o usuário:', error)
			toast({
				title: 'Erro ao cadastrar o usuário',
				description:
					'Ocorreu um erro ao tentar cadastrar o usuário. Tente novamente.',
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
						Adicionar usuário
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[350px] sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Adicionar usuário</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para adicionar um novo usuário.
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
								placeholder="Nome do usuário"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="col-span-3"
								type="email"
								placeholder="Email do usuário"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="isAdmin" className="text-right">
								Admin
							</Label>
							<Switch
								id="isAdmin"
								checked={isAdmin}
								onCheckedChange={setIsAdmin}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" size="sm">
							Salvar usuário <CheckCircle size={16} className="text-sm ml-2" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
