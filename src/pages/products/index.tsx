import { File, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AddProduct } from "@/components/add-product";
import { CategoriesTable } from "@/components/categories-table";
import { ProductsTable } from "@/components/products-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalContext } from "@/contexts/GlobalContext";
import { api } from "@/services/apiClient";
import type { Categories } from "@/types/category";
import type { ProductList } from "@/types/product";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useContext, useEffect } from "react";

export default function Products() {
	const { products, setProducts, setCategories, categories } =
		useContext(GlobalContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const getProducts = async () => {
			try {
				const response = await api.get<ProductList>("/product/all");
				setProducts(response.data);
				const categories = await api.get<Categories>("/category");
				setCategories(categories.data);
			} catch {
				console.error("Error fetching products");
			}
		};
		getProducts();
	}, []);

	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Tabs defaultValue="products">
				<div className="flex items-center">
					<TabsList>
						<TabsTrigger value="products">Products</TabsTrigger>
						<TabsTrigger value="categories">Categories</TabsTrigger>
					</TabsList>
					<div className="ml-auto flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="h-7 gap-1">
									<ListFilter className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
										Filter
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Filter by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem checked>
									Active
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button size="sm" variant="outline" className="h-7 gap-1">
							<File className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Export
							</span>
						</Button>
						<AddProduct />
					</div>
				</div>
				<TabsContent value="products">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Products</CardTitle>
							<CardDescription>
								Manage your products and view their sales performance.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductsTable products={products} />
						</CardContent>
						<CardFooter>
							<div className="text-xs text-muted-foreground">
								Showing <strong>1-10</strong> of <strong>32</strong> products
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="categories">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Categories</CardTitle>
							<CardDescription>
								Manage your categories and view their sales performance.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CategoriesTable categories={categories} />
						</CardContent>
						<CardFooter>
							<div className="text-xs text-muted-foreground">
								Showing <strong>1-10</strong> of <strong>32</strong> categories
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</main>
	);
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
	return {
		props: {},
	};
});
