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
import type { Product, ProductList } from '@/types/product'
import { ChevronDown, ChevronsUpDown, EllipsisVertical, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export const columns: ColumnDef<Product>[] = [
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
		accessorKey: 'banner',
		header: 'Banner',
		cell: ({ row }) => (
			<div className="capitalize">
				<img
					src={row.getValue('banner')}
					alt="product-image"
					width={50}
					height={50}
					className="rounded-lg"
				/>
			</div>
		),
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
		accessorKey: 'category',
		header: 'Categoria',
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue('category')}</div>
		),
	},
	{
		accessorKey: 'price',
		header: () => <div className="text-right">Preço</div>,
		cell: ({ row }) => {
			const price = row.getValue('price')
			const amount = Number.parseFloat(row.getValue('price'))

			const formatted = new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}).format(amount)

			return <div className="text-right font-medium">{formatted}</div>
		},
	},
	{
		id: 'Ações',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original
			const { setProducts } = React.useContext(GlobalContext)

			const deleteProduct = async () => {
				try {
					await api.delete(`/product/${payment.id}`)
					setProducts((prev) => prev.filter((p) => p.id !== payment.id))
					toast('Produto deletado', {
						description: `${payment.name} foi deletado com sucesso.`,
						icon: '😶',
					})
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
						<DropdownMenuItem>
							<Button
								className="h-7 w-full"
								variant="destructive"
								onClick={deleteProduct}
							>
								Deletar
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

interface ProductsTableProps {
	products: ProductList
}

export function ProductsTable({ products }: ProductsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data: products,
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
			<div className="flex items-center py-4 justify-between gap-2">
				<Input
					placeholder="Filtrar por nome..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<Button>
					<Link href="/products/new">Novo produto</Link>
				</Button>
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
	)
}
