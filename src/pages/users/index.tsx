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
			<Tabs defaultValue="users">
				<div className="flex items-center">
					<TabsList>
						<TabsTrigger value="users">Users</TabsTrigger>
					</TabsList>
					<div className="ml-auto flex items-center gap-2">
						<AddUser />
					</div>
				</div>
				<TabsContent value="users">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Products</CardTitle>
							<CardDescription>
								Manage your products and view their sales performance.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<UsersTable users={users} />
						</CardContent>
						<CardFooter>
							<div className="text-xs text-muted-foreground">
								Showing <strong>1-10</strong> of <strong>32</strong> products
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</main>
	)
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
	return {
		props: {},
	}
})
