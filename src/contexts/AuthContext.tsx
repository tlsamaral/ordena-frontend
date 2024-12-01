import { AlterPassword } from '@/components/alter-password'
import { api } from '@/services/apiClient'
import type { AuthData } from '@/types/auth'
import axios, { type AxiosError } from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { type ReactNode, createContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
// import { toast } from 'react-toastify'

type AuthContextData = {
	user: UserProps | null
	isAuthenticated: boolean
	signIn: (credentials: SignInProps) => Promise<void>
	signOut: () => void
}

type UserProps = AuthData

type SignInProps = {
	email: string
	password: string
}

type SignUpProps = {
	name: string
	email: string
	password: string
}

type AuthProviderProps = {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
	try {
		destroyCookie(undefined, '@nextauth.token')
		Router.push('/')
	} catch {
		console.log('erro ao deslogar')
	}
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps | null>(null)
	const isAuthenticated = !!user

	useEffect(() => {
		const { '@nextauth.token': token } = parseCookies()
		if (token) {
			api
				.get<UserProps>('/me')
				.then((response) => {
					const user = response.data
					setUser(user)
				})
				.catch(() => {
					signOut()
				})
		}
	}, [])

	async function signIn({ email, password }: SignInProps) {
		try {
			const response = await api.post<AuthData>('/session', {
				email,
				password,
			})
			toast('Seja bem vindo de volta', {
				description: 'Como é bom ter vocé de volta',
				icon: <CheckCircle size={20} className="text-green-500" />,
				richColors: true,
				position: 'top-center',
			})
			const user = response.data
			const { token } = user
			setCookie(undefined, '@nextauth.token', token, {
				maxAge: 60 * 60 * 24 * 30, // 1 mês
				path: '/',
			})

			setUser(user)
			api.defaults.headers.Authorization = `Bearer ${token}`
			Router.push('/dashboard')
		} catch (err) {
			const errors = err as Error | AxiosError
			if (axios.isAxiosError(errors) && errors.response) {
				toast('Erro ao acessar', {
					description: errors.response.data.error,
					className: 'dark:bg-red-900 dark:text-white dark:bg-red-500',
					icon: <XCircle size={20} className="text-red-500" />,
					richColors: true,
					position: 'top-center',
				})
			}
		}
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
			<AlterPassword />
			{children}
		</AuthContext.Provider>
	)
}
