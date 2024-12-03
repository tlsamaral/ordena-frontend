import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthContext } from '@/contexts/AuthContext'
import { api } from '@/services/apiClient'
import { canSSRGuest } from '@/utils/canSSRGuest'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const description =
	"A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

const SigInSchema = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(1, 'Password is required'),
})

type SigInScrema = z.infer<typeof SigInSchema>

export default function Login() {
	const { signIn } = useContext(AuthContext)
	const { register, handleSubmit } = useForm<SigInScrema>({
		resolver: zodResolver(SigInSchema),
	})

	function handleSigIn(data: SigInScrema) {
		try {
			signIn(data)
		} catch {
			console.error('Error signing in')
		}
	}

	return (
		<div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] sm:overflow-hidden">
			<div className="h-full flex items-center justify-center py-12 bg-gradient-to-l dark:from-zinc-900 dark:to-zinc-950 from-zinc-50 to-zinc-200">
				<div className="mx-auto grid gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold text-muted-foreground">
							Acessar
						</h1>
						<p className="text-balance text-muted-foreground">
							Acesse digitando seu e-mail e sua senha abaixo
						</p>
					</div>
					<form onSubmit={handleSubmit(handleSigIn)} className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...register('email')}
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Senha</Label>
								<Link
									href="/forgot-password"
									className="ml-auto inline-block text-sm underline"
								>
									Esqueceu sua senha?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="Sua senha.."
								{...register('password')}
							/>
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Não tem uma conta?{' '}
						<Link href="/signup" className="underline">
							Solicite acesso
						</Link>
					</div>
				</div>
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
