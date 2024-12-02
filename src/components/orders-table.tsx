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
import type { Order, OrderTypes } from '@/types/order'
import { formatDistance } from '@/utils/formatDistanceToNow'
import { getOrderStatusName } from '@/utils/getOrderStatusName'
import {
	ArrowRightLeft,
	ArrowUpDown,
	CheckCircle,
	ChevronDown,
	ChevronsUpDown,
	EllipsisVertical,
	X,
} from 'lucide-react'
import { toast } from 'sonner'
import NewOrderBase from './new-order-base'
import { OrderStatus } from './order-status'
import { OrderView } from './order-view'

export const columns: ColumnDef<Order>[] = [
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
		accessorKey: 'table',
		header: 'Número',
		cell: ({ row }) => {
			const tableName = row.original.table.name
			return <div className="capitalize">{tableName}</div>
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-1"
				>
					Nome
					<ChevronsUpDown className="ml-2 h-4 w-4 " />
				</Button>
			)
		},
		cell: ({ row }) => (
			<div className="capitalize pl-2">{row.getValue('name')}</div>
		),
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 px-1">
							<span className="sr-only">Filtrar status</span>
							Status do pedido
							<ArrowRightLeft className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="center">
						<DropdownMenuItem
							onClick={() => column.setFilterValue('A')} // Define o filtro como "Abertos"
						>
							<Checkbox
								aria-label="Select row"
								checked={column.getFilterValue() === 'A'}
							/>
							Abertos
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => column.setFilterValue('P')}>
							<Checkbox
								aria-label="Select row"
								checked={column.getFilterValue() === 'P'}
							/>
							Em preparo
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>
							<Checkbox
								aria-label="Select row"
								checked={column.getFilterValue() === undefined}
							/>
							Todos
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
		cell: ({ row }) => {
			const orderStatus = row.getValue('status') as OrderTypes
			return (
				<div className="capitalize pl-2 flex items-center gap-2">
					<OrderStatus orderStatus={orderStatus} />{' '}
					{getOrderStatusName(orderStatus)}
				</div>
			)
		},
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="h-8 px-1"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				<span className="sr-only">Data de abertura</span>
				Abertura do pedido
				<ArrowUpDown className="h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="capitalize">
				{formatDistance(row.getValue('created_at'))}
			</div>
		),
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const finishOrder = async () => {
				try {
					await api.put('/order/finish', {
						order_id: row.original.id,
					})
				} catch (error) {
					console.error(error)
				}
			}

			const processOrder = async () => {
				try {
					await api.put('/order/process', {
						order_id: row.original.id,
					})
				} catch (error) {
					console.error(error)
				}
			}

			const { setRealTimeOrders } = React.useContext(GlobalContext)
			const cancelOrder = async () => {
				try {
					await api.put('/order/cancel', {
						order_id: row.original.id,
					})
					toast('Pedido cancelado', {
						description: `O pedido de ${row.original.name} foi cancelado com sucesso.`,
						icon: <CheckCircle size={14} className="text-green-500" />,
					})
					setRealTimeOrders((prevOrders) =>
						prevOrders.filter((order) => order.id !== row.original.id),
					)
				} catch (error) {
					console.error(error)
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
						<DropdownMenuItem asChild>
							<Button
								className="h-7 w-full"
								variant="ghost"
								onClick={processOrder}
							>
								Preparar Pedido
							</Button>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button
								className="h-7 w-full"
								variant="ghost"
								onClick={finishOrder}
							>
								Finalizar pedido
							</Button>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button
								className="h-7 w-full hover:text-red-500"
								variant="ghost"
								onClick={cancelOrder}
							>
								Cancelar pedido
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

interface OrdersTableProps {
	orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [orderIsView, setOrderIsView] = React.useState(false)
	const [orderForView, setOrderForView] = React.useState<Order | null>(null)

	const table = useReactTable({
		data: orders,
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

	function handleViewOrder(order: Order) {
		setOrderIsView(true)
		setOrderForView(order)
	}

	return (
		<div className="w-full max-w-full">
			<div className="w-full max-w-full overflow-x-auto">
				<div className="flex items-center justify-between py-2 gap-4">
					<Input
						placeholder="Filtrar pedidos por mesa..."
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn('name')?.setFilterValue(event.target.value)
						}
						className="max-w-sm h-8"
					/>
					<NewOrderBase />
				</div>
				<div className="rounded-md border">
					<Table className="w-full min-w-[600px]">
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
										onDoubleClick={() => handleViewOrder(row.original)}
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
						{table.getFilteredSelectedRowModel().rows.length} de{' '}
						{table.getFilteredRowModel().rows.length} linhas(s) selecionados.
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
			{orderIsView && orderForView && (
				<OrderView
					open={orderIsView}
					setOpen={setOrderIsView}
					order={orderForView}
				/>
			)}
		</div>
	)
}
