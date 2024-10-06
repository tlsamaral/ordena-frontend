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
import { CheckIcon, type File, PlusCircle, Upload } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { Button } from './ui/button'

export function AddProduct() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [imageBanner, setBanner] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState('')

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Dados a serem enviados
    const productData = {
      name,
      price: Number(price), // Converte para número, caso necessário
      description,
      imageBanner,
      category_id: Number(categoryId), // Converte o ID da categoria para número
    }

    try {
      // Envia os dados para sua API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        // Produto cadastrado com sucesso
        alert('Produto cadastrado com sucesso!')
        // Aqui você pode limpar o formulário ou fechar o modal, por exemplo
      } else {
        // Lida com o erro
        alert('Erro ao cadastrar o produto')
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error)
      alert('Erro ao cadastrar o produto')
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

    if (image.type === 'image/jpeg' || image.type === 'image/png') {
      setBanner(image)
      setBannerUrl(URL.createObjectURL(image))
    }
  }

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
            <Label>Choose image</Label>
            <label className="w-16 h-16 rounded-full overflow-hidden border relative flex justify-center items-center cursor-pointer hover:brightness-75 transition-all ">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFile}
              />
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  className="w-16 h-16"
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
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                type="number"
                step="0.01"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category_id" className="text-right">
                Category ID
              </Label>
              <Input
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="col-span-3"
                type="number"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" size="sm">
              Save product <CheckIcon size={16} className="text-sm ml-3" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
