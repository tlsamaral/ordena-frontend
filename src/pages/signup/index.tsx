import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthContext } from '@/contexts/AuthContext'
import { api } from '@/services/apiClient'
import { canSSRGuest } from '@/utils/canSSRGuest'
import { zodResolver } from '@hookform/resolvers/zod'
import { HandPlatter } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SignUpSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z
			.string()
			.email('E-mail não é valido')
			.min(1, 'E-mail é obrigatorio'),
		password: z.string().min(1, 'Digite a senha'),
		confirmPassword: z.string().min(1, 'Confirme a senha'),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				path: ['confirmPassword'],
				message: 'Senhas nao conferem',
				code: z.ZodIssueCode.custom,
			})
		}
	})

type SignUpSchemaData = z.infer<typeof SignUpSchema>

export default function SignUp() {
	const [waiting, setWaiting] = useState(false)
	const { signIn } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpSchemaData>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	function handleSigIn(data: SignUpSchemaData) {
		try {
			const response = api.post('/users', {
				name: data.name,
				email: data.email,
				password: data.password,
			})

			setWaiting(true)
		} catch {
			console.error('Error signing in')
		}
	}

	return (
		<div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] sm:overflow-hidden">
			<div className="h-full flex items-center justify-center py-12 bg-gradient-to-l dark:from-zinc-900 dark:to-zinc-950 from-zinc-50 to-zinc-200">
				{waiting ? (
					<section>
						<div className="flex items-center gap-4 flex-col max-w-[400px]">
							<h1 className="text-3xl font-bold text-center">Feito! 🚀🔥</h1>
							<p className="text-muted-foreground text-center">
								O seu acesso foi solicitado com sucesso, agora é só aguardar com
								que o admin aceite sua solicitação, assim que isso acontecer
								vocé receberá um e-mail de confirmação.
							</p>

							<Button variant="secondary" asChild>
								<Link href="/">Ir para o login</Link>
							</Button>
						</div>
					</section>
				) : (
					<div className="mx-auto grid gap-6">
						<div className="grid gap-2">
							<h1 className="text-3xl font-bold">Solicitar acesso</h1>
							<p className="text-muted-foreground">
								Preencha seus dados abaixo e solicite o seu acesso
							</p>
						</div>
						<form onSubmit={handleSubmit(handleSigIn)} className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="name">Nome</Label>
								<Input
									id="name"
									type="name"
									placeholder="John Doe"
									{...register('name')}
								/>
								<p className="text-xs text-red-400 text-right">
									{errors.name?.message}
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									{...register('email')}
								/>
								<p className="text-xs text-red-400 text-right">
									{errors.email?.message}
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Senha</Label>
								<Input
									id="password"
									type="password"
									placeholder="Sua senha..."
									{...register('password')}
								/>
								<p className="text-xs text-red-400 text-right">
									{errors.password?.message}
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="confirmPassword">Confirmar senha</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirme sua senha..."
									{...register('confirmPassword')}
								/>
								<p className="text-xs text-red-400 text-right">
									{errors.confirmPassword?.message}
								</p>
							</div>
							<Button type="submit" className="w-full">
								Solicitar acesso
							</Button>
						</form>
						<div className="mt-4 text-center text-sm">
							Já tem uma conta?{' '}
							<Link href="/" className="underline">
								Realizar acesso
							</Link>
						</div>
					</div>
				)}
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src="/image-darker.webp"
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	)
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
	return {
		props: {},
	}
})
