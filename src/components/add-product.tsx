import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToastAction } from '@/components/ui/toast'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/services/apiClient'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import {
	CheckCircle,
	Package2,
	PlusCircle,
	Tag,
	Trash,
	Upload,
} from 'lucide-react'
import Link from 'next/link'
import { type ChangeEvent, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { SearchCategory } from './search-category'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'

export function AddProduct() {
	const [name, setName] = useState('')
	const [price, setPrice] = useState('')
	const [description, setDescription] = useState('')
	const [bannerUrl, setBannerUrl] = useState('')
	const [imageBanner, setBanner] = useState<File | null>(null)
	const [categoryId, setCategoryId] = useState('')
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const { setProducts } = useContext(GlobalContext)

	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await api('/category')
				setCategories(response.data)
			} catch (err) {
				console.error(err)
			}
		}
		getCategories()
	}, [])

	const formatPriceToBRL = (value: string) => {
		const cleanedValue = value.replace(/\D/g, '')
		const formattedValue = (Number(cleanedValue) / 100).toLocaleString(
			'pt-BR',
			{
				style: 'currency',
				currency: 'BRL',
			},
		)

		return formattedValue
	}

	const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value
		const formattedValue = formatPriceToBRL(inputValue)
		setPrice(formattedValue)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (imageBanner === null) {
			return
		}
		const formData = new FormData()

		const numericPrice = price.replace(/[^\d,]/g, '').replace(',', '.')

		formData.append('name', name)
		formData.append('price', numericPrice)
		formData.append('description', description)
		formData.append('category_id', categoryId)
		formData.append('file', imageBanner)

		try {
			setIsLoading(true)
			const response = await api.post<Product>('/product', formData)
			setProducts((prev) => [...prev, { ...response.data }])

			toast('Produto cadastrado com sucesso!', {
				description: `O produto "${response.data.name}" foi adicionado.`,
				action: (
					<ToastAction className="ml-auto" altText="Desfazer ação">
						Desfazer
					</ToastAction>
				),
			})
		} catch (error) {
			console.error('Erro ao cadastrar o produto:', error)
			toast('Erro ao cadastrar o produto', {
				description:
					'Ocorreu um erro ao tentar cadastrar o produto. Tente novamente.',
				action: (
					<ToastAction className="ml-auto" altText="Tentar novamente">
						Tentar novamente
					</ToastAction>
				),
			})
		} finally {
			setIsLoading(false)
		}
	}

	function handleFile(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) {
			return
		}
		const image = e.target.files[0]
		if (!image) {
			return
		}
		setBanner(image)
		setBannerUrl(URL.createObjectURL(image))
	}

	const categoryChange = (category: Category) => {
		setCategoryId(category.id)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-8 py-4 w-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
					<div className="col-span-1 flex flex-col justify-start gap-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<span className="text-xs text-neutral-100/80">
								Digite o nome deste produto
							</span>
						</div>
					</div>
					<div className="col-span-2">
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="col-span-3"
							placeholder="Nome do produto.."
							required
						/>
					</div>
				</div>
				<Separator orientation="horizontal" />

				<div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
					<div className="col-span-1 flex flex-col justify-start gap-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="price">Preço</Label>
							<span className="text-xs text-neutral-100/80">
								Defina aqui o preço deste produto
							</span>
						</div>
					</div>
					<div className="col-span-2">
						<Input
							id="price"
							value={price}
							onChange={handlePriceChange}
							className="col-span-3"
							type="text"
							placeholder="Valor do produto..."
							required
						/>
					</div>
				</div>
				<Separator orientation="horizontal" />
				<div className="grid grid-cols-1 md:grid-cols-4  gap-4">
					<div className="col-span-1 flex flex-col justify-start gap-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Escolha a imagem do produto</Label>
							<span className="text-xs text-neutral-100/80">
								Selecione a imagem de exibição deste produto
							</span>
						</div>
					</div>
					<div className="col-span-2">
						<div className="flex justify-end items-start gap-4 flex-col md:flex-row">
							<div>
								<div className="w-16 h-16 mx-3 rounded-full overflow-hidden flex justify-center items-center border">
									{bannerUrl ? (
										<img
											src={bannerUrl}
											className="w-full h-full"
											alt="Foto do produto"
										/>
									) : (
										<Package2 size={14} />
									)}
								</div>
								{bannerUrl && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => {
											setBanner(null)
											setBannerUrl('')
										}}
										className="mx-auto my-3 rounded-full overflow-hidden flex justify-center items-center"
									>
										<Trash size={14} />
									</Button>
								)}
							</div>
							<label className="w-full h-36 rounded-lg overflow-hidden border relative flex flex-col justify-center items-center cursor-pointer hover:brightness-75 transition-all gap-2">
								<input
									type="file"
									className="hidden"
									onChange={handleFile}
									required
									accept="image/png, image/jpeg, image/svg, image/webp, image/gif"
								/>
								<span className="p-3 rounded-full bg-zinc-900 border">
									<Upload size={16} color="#fff" />
								</span>
								<span className="text-zinc-100">
									<span className="text-red-400">Clique aqui</span> para
									adicionar uma imagem
								</span>
								<span className="text-xs text-neutral-400/80">
									SVG, PNG, JPG, WEBP ou GIF (MAX. 400x400px)
								</span>
							</label>
						</div>
					</div>
				</div>
				<Separator orientation="horizontal" />
				<div className="grid grid-cols-4 items-start gap-4">
					<div className="col-span-1 flex flex-col justify-start gap-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="category_id">Categoria do produto</Label>
							<span className="text-xs text-neutral-100/80">
								É necessário selecionar uma categoria
							</span>
						</div>
					</div>
					<div className="col-span-2">
						<SearchCategory
							className="w-full"
							categories={categories}
							onCategoryChange={categoryChange}
							categoryIdSelected={categoryId}
							setCategories={setCategories}
						/>
					</div>
				</div>
				<Separator orientation="horizontal" />
				<div className="grid grid-cols-4 items-start gap-4">
					<div className="col-span-1 flex flex-col justify-start gap-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="description">Descrição</Label>
						</div>
					</div>
					<div className="col-span-2">
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Deixe uma breve descrição do produto..."
							required
						/>
					</div>
				</div>
				<Separator orientation="horizontal" />
			</div>
			<div className="flex justify-end gap-4">
				<Button
					type="button"
					size="sm"
					variant="secondary"
					disabled={isLoading}
					asChild
				>
					<Link href="/products">Cancelar</Link>
				</Button>
				<Button type="submit" size="sm" disabled={isLoading}>
					Salvar <CheckCircle size={16} className="text-sm ml-1" />
				</Button>
			</div>
		</form>
	)
}
