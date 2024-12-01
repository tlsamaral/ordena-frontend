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
import { AuthContext } from '@/contexts/AuthContext'
import { api } from '@/services/apiClient'
import { CheckCircle, Lock } from 'lucide-react'
import { use, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export function AlterPassword() {
	const { user } = useContext(AuthContext)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (user?.alter_password) {
			setPassword('')
			setConfirmPassword('')
			setOpen(true)
		}
	}, [user])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (password !== confirmPassword) {
			toast('Erro', {
				description: 'As senhas não coincidem. Tente novamente.',
				icon: <Lock size={14} className="text-red-500" />,
			})
			return
		}

		try {
			await api.put('/users/change-password', { password, user_id: user?.id })

			setOpen(false)

			toast('Senha alterada', {
				description: 'Sua senha foi alterada com sucesso.',
				icon: <CheckCircle size={14} className="text-green-500" />,
			})
		} catch (error) {
			console.error('Erro ao alterar a senha:', error)
			toast('Erro ao alterar a senha', {
				description:
					'Ocorreu um erro ao tentar alterar sua senha. Tente novamente.',
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-[350px] sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Alterar Senha</DialogTitle>
					<DialogDescription>
						Preencha os campos abaixo para alterar sua senha.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="password" className="text-right">
								Senha
							</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="col-span-3"
								placeholder="Digite sua nova senha"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="confirmPassword" className="text-right">
								Confirmar Senha
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="col-span-3"
								placeholder="Confirme sua nova senha"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" size="sm">
							Alterar <CheckCircle size={16} className="text-sm ml-2" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
