import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/apiClient";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { CheckCircle, PlusCircle, Upload } from "lucide-react";
import { type ChangeEvent, useContext, useEffect, useState } from "react";
import { SearchCategory } from "./search-category";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function AddProduct() {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [bannerUrl, setBannerUrl] = useState("");
	const [imageBanner, setBanner] = useState<File | null>(null);
	const [categoryId, setCategoryId] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);

	const { toast } = useToast();
	const { setProducts } = useContext(GlobalContext);

	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await api("/category");
				setCategories(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		getCategories();
	}, []);

	const formatPriceToBRL = (value: string) => {
		const cleanedValue = value.replace(/\D/g, "");
		const formattedValue = (Number(cleanedValue) / 100).toLocaleString(
			"pt-BR",
			{
				style: "currency",
				currency: "BRL",
			},
		);

		return formattedValue;
	};

	const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const formattedValue = formatPriceToBRL(inputValue);
		setPrice(formattedValue);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (imageBanner === null) {
			return;
		}
		const formData = new FormData();

		const numericPrice = price.replace(/[^\d,]/g, "").replace(",", ".");

		formData.append("name", name);
		formData.append("price", numericPrice);
		formData.append("description", description);
		formData.append("category_id", categoryId);
		formData.append("file", imageBanner);

		try {
			const response = await api.post<Product>("/product", formData);
			console.log(response);
			setProducts((prev) => [...prev, { ...response.data }]);

			toast({
				title: "Produto cadastrado com sucesso!",
				description: `O produto "${response.data.name}" foi adicionado.`,
				action: <ToastAction altText="Desfazer ação">Desfazer</ToastAction>,
			});
		} catch (error) {
			console.error("Erro ao cadastrar o produto:", error);
			toast({
				title: "Erro ao cadastrar o produto",
				description:
					"Ocorreu um erro ao tentar cadastrar o produto. Tente novamente.",
				variant: "destructive",
				action: (
					<ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>
				),
			});
		}
	};

	function handleFile(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) {
			return;
		}
		const image = e.target.files[0];
		if (!image) {
			return;
		}

		if (image.type === "image/jpeg" || image.type === "image/png") {
			setBanner(image);
			setBannerUrl(URL.createObjectURL(image));
		}
	}

	const categoryChange = (category: Category) => {
		setCategoryId(category.id);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" className="h-7 gap-1">
					<PlusCircle className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Add Product
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] bg-zinc-900">
				<DialogHeader>
					<DialogTitle>Add Product</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para adicionar um novo produto.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="flex justify-end items-center gap-4">
						<label className="w-full h-32 rounded-lg overflow-hidden border relative flex justify-center items-center cursor-pointer hover:brightness-75 transition-all ">
							<input
								type="file"
								accept="image/png, image/jpeg"
								className="hidden"
								onChange={handleFile}
							/>
							{bannerUrl ? (
								<img
									src={bannerUrl}
									className="w-full h-full"
									alt="Foto do produto"
								/>
							) : (
								<span>
									<Upload size={20} color="#fff" />
								</span>
							)}
						</label>
					</div>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="col-span-3"
								placeholder="Product name"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="price" className="text-right">
								Price
							</Label>
							<Input
								id="price"
								value={price}
								onChange={handlePriceChange}
								className="col-span-3"
								type="text"
								placeholder="Price of product"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="category_id" className="text-right">
								Category
							</Label>
							<SearchCategory
								className="col-span-3"
								categories={categories}
								onCategoryChange={categoryChange}
								categoryIdSelected={categoryId}
								setCategories={setCategories}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="description" className="text-right">
								Description
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="col-span-3"
								placeholder="Write a description"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" size="sm">
							Save product <CheckCircle size={16} className="text-sm ml-3" />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
