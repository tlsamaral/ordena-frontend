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
import { AddTable } from '@/components/add-table'
import { AddUser } from '@/components/add-user'
import { TablesTable } from '@/components/table-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersTable } from '@/components/users-table'
import { GlobalContext } from '@/contexts/GlobalContext'
import { api } from '@/services/apiClient'
import type { Users } from '@/types/user'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { useContext, useEffect, useState } from 'react'

export default function UsersPage() {
	const { tables, setTables } = useContext(GlobalContext)

	useEffect(() => {
		async function getTables() {
			const response = await api.get('/tables')
			const { data } = response
			setTables(data)
		}
		getTables()
	}, [setTables])

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Mesas</CardTitle>
					<CardDescription>Administre as mesas do restaurante</CardDescription>
				</CardHeader>
				<CardContent>
					<TablesTable tables={tables} />
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
