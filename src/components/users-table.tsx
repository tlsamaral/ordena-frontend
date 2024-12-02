import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { GlobalContext } from '@/contexts/GlobalContext'
import { api } from '@/services/apiClient'
import type { User, Users } from '@/types/user'
import { ChevronDown, ChevronsUpDown, EllipsisVertical, X } from 'lucide-react'
import { toast } from 'sonner'
import { AddUser } from './add-user'
import { Badge } from './ui/badge'

export const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nome
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue('email')}</div>
		),
	},
	{
		accessorKey: 'admin',
		header: 'Perfil',
		cell: ({ row }) => {
			const payment = row.original
			const role = payment.admin ? 'Administrador' : 'Usuário'

			return (
				<div className="capitalize">
					<Badge className="h-5 px-3">{role}</Badge>
				</div>
			)
		},
	},
	{
		accessorKey: 'permission',
		header: 'Permissão',
		cell: ({ row }) => {
			const user = row.original
			const role = user.permission ? 'Aceito' : 'Pendente'

			return (
				<div className="capitalize flex items-center gap-2">
					<div
						className={`h-2 w-2 rounded-full ${user.permission ? 'bg-green-500' : 'bg-red-500'}`}
					/>
					{role}
				</div>
			)
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const { setUsers } = React.useContext(GlobalContext)
			const user = row.original
			function acceptUser() {
				try {
					api.put('/users/accept', {
						user_id: user.id,
					})
					toast('Feito! 🚀', {
						description: `${user.name} foi aceito com sucesso, e agora já pode logar na plataforma.`,
						icon: '🚀',
					})
					setUsers((prev) =>
						prev.map((u) =>
							u.id === user.id ? { ...u, permission: true } : u,
						),
					)
				} catch (error) {
					console.error(error)
				}
			}

			function rejectUser() {
				try {
					api.put('/users/reject', {
						user_id: user.id,
					})
					toast('Feito! 😓', {
						description: `${user.name} não pode mais acessar a plataforma.`,
						icon: '😓',
					})
					setUsers((prev) =>
						prev.map((u) =>
							u.id === user.id ? { ...u, permission: false } : u,
						),
					)
				} catch (error) {
					console.error(error)
				}
			}

			const handleUserPermission = () => {
				if (user.permission) {
					rejectUser()
				} else {
					acceptUser()
				}
			}

			const deleteUser = async () => {
				try {
					await api.delete(`/users/${user.id}`)
					setUsers((prev) => prev.filter((u) => u.id !== user.id))
					toast('Usuário deletado', {
						description: `${user.name} foi deletado com sucesso.`,
						icon: '😶',
					})
					setUsers((prev) => prev.filter((u) => u.id !== user.id))
				} catch (err) {
					console.error(err)
					toast('', {
						icon: <X size={14} />,
						className:
							'destructive group border-destructive bg-destructive text-destructive-foreground',
						description: 'Ocorreu um erro ao deletar este produto.',
					})
				}
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<EllipsisVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem onClick={handleUserPermission}>
							{user.permission ? 'Remover permissão' : 'Atribuir permissão'}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Button
								className="h-7 w-full"
								variant="destructive"
								onClick={deleteUser}
							>
								Delete
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

interface UsersTableProps {
	users: Users
}

export function UsersTable({ users }: UsersTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data: users,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div className="w-full">
			<div className="flex items-center py-2 gap-4 justify-between">
				<Input
					placeholder="Filtrar por nome..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<AddUser />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Próximo
					</Button>
				</div>
			</div>
		</div>
	)
}
