import { File, ListFilter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
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

import { CategoriesTable } from '@/components/categories-table'
import { ProductsTable } from '@/components/products-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GlobalContext } from '@/contexts/GlobalContext'
import { api } from '@/services/apiClient'
import type { Categories } from '@/types/category'
import type { ProductList } from '@/types/product'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { useContext, useEffect, useState } from 'react'

export default function Products() {
	const { products, setProducts, setCategories, categories } =
		useContext(GlobalContext)
	const [addProduct, setAddProduct] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const getProducts = async () => {
			try {
				const response = await api.get<ProductList>('/product/all')
				setProducts(response.data)
				const categories = await api.get<Categories>('/category')
				setCategories(categories.data)
			} catch {
				console.error('Error fetching products')
			}
		}
		getProducts()
	}, [])

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 h-full">
			<Tabs defaultValue="products">
				<TabsList>
					<div className="flex items-center">
						<TabsTrigger value="products">Produtos</TabsTrigger>
						<TabsTrigger value="categories">Categorias</TabsTrigger>
					</div>
				</TabsList>
				<TabsContent value="products">
					<Card
						x-chunk="dashboard-06-chunk-0"
						className="max-w-full overflow-hidden"
					>
						<CardHeader>
							<CardTitle>Produtos</CardTitle>
							<CardDescription>
								Administre os produtos da sua loja.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductsTable products={products} />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="categories">
					<Card
						x-chunk="dashboard-06-chunk-0"
						className="max-w-full overflow-hidden"
					>
						<CardHeader>
							<CardTitle>Categorias</CardTitle>
							<CardDescription>
								Administre as categorias de produtos.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CategoriesTable categories={categories} />
						</CardContent>
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
