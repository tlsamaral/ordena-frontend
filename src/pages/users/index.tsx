import { File, ListFilter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { AddProduct } from '@/components/add-product'
import { AddUser } from '@/components/add-user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersTable } from '@/components/users-table'
import { GlobalContext } from '@/contexts/GlobalContext'
import { api } from '@/services/apiClient'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { useContext, useEffect } from 'react'

export default function UsersPage() {
	const { users, setUsers } = useContext(GlobalContext)

	useEffect(() => {
		async function getUsers() {
			const response = await api.get('/users/all')
			const { data } = response
			setUsers(data)
		}
		getUsers()
	}, [setUsers])

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Card
				x-chunk="dashboard-06-chunk-0"
				className="max-w-full overflow-hidden"
			>
				<CardHeader>
					<CardTitle>Usuários</CardTitle>
					<CardDescription>Gerencie os usuários do restaurante</CardDescription>
				</CardHeader>
				<CardContent>
					<UsersTable users={users} />
				</CardContent>
			</Card>
		</main>
	)
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
	return {
		props: {},
	}
})
