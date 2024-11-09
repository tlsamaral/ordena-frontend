import ProductCell from '@/components/product-cell'
import { SearchCategory } from '@/components/search-category'
import { SearchProduct } from '@/components/search-product'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import type { Categories, Category } from '@/types/category'
import type { OrderById, ProductOrder } from '@/types/order'
import type { Product, ProductList } from '@/types/product'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { formatDistance } from '@/utils/formatDistanceToNow'
import { Send } from 'lucide-react'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface NewOrderPageProps {
  orderDetails: OrderById | null
  categories: Categories
  products: ProductList
}

export default function NewOrderPage({
  orderDetails,
  categories,
  products,
}: NewOrderPageProps) {
  const [categorySelected, setCategorySelected] = useState('')
  const [productsList, setProductsList] = useState<ProductOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)

  if (orderDetails === null) {
    return notFound()
  }

  const handleSelectCategory = (category: Category) => {
    setCategorySelected(category.id)
  }

  const handleSelectProduct = (product: Product) => {
    setProductsList((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        amount: 1,
        price: Number(product.price),
      },
    ])
  }

  const handleRemoveProduct = (product_id: string) => {
    setProductsList((prev) =>
      prev.filter((product) => product.id !== product_id),
    )
  }

  const sendOrder = async () => {
    try {
      setIsLoading(true)
      await api.put('/order/send-full', {
        order_id: orderDetails.id,
        products: productsList,
      })

      setProductsList([])
      setCategorySelected('')
      toast('Pedido enviado com sucesso', {
        description: 'O pedido foi enviado com sucesso para a cozinha.',
      })
    } catch (error) {
      toast('Erro ao enviar pedido')
    } finally {
      setIsLoading(false)
    }
  }

  let productsListed = products
  if (categorySelected) {
    productsListed = products.filter(
      (product) => product.category_id === categorySelected,
    )
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Novo pedido</CardTitle>
          <CardDescription>
            Nesta seção voce pode adicionar um pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 py-4 w-auto">
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Código do pedido</Label>
                </div>
              </div>
              <div className="col-span-3">
                <Input
                  className="col-span-3"
                  type="text"
                  value={orderDetails.id}
                  disabled
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                </div>
              </div>
              <div className="col-span-3">
                <Input
                  className="col-span-3"
                  type="text"
                  value={orderDetails.name}
                  disabled
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Informações</Label>
                  <span className="text-xs text-neutral-100/80">
                    Informações como status e tempo de criação
                  </span>
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <Input
                  className="col-span-1"
                  type="text"
                  value={orderDetails ? 'Aberto' : 'Fechado'}
                  disabled
                />
                <Input
                  className="col-span-1"
                  type="text"
                  value={formatDistance(orderDetails.created_at)}
                  disabled
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cateory">Categoria de produtos</Label>
                  <span className="text-xs text-neutral-100/80">
                    Selecione a categoria para filtrar produtos
                  </span>
                </div>
              </div>
              <div className="col-span-3">
                <SearchCategory
                  categories={categories}
                  categoryIdSelected={categorySelected}
                  onCategoryChange={handleSelectCategory}
                  className="w-full"
                  isRegister={false}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cateory">Categoria de produtos</Label>
                  <span className="text-xs text-neutral-100/80">
                    Selecione a categoria para filtrar produtos
                  </span>
                </div>
              </div>
              <div className="col-span-3">
                <SearchProduct
                  products={products}
                  onProductChange={handleSelectProduct}
                  productsListed={productsList}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-1 flex flex-col justify-start gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cateory">Listagem de produtos</Label>
                  <span className="text-xs text-neutral-100/80">
                    Ao lado a lista de produtos selecionados
                  </span>
                </div>
              </div>
              <div className="col-span-3">
                {productsList.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {productsList.map((product) => (
                      <ProductCell
                        product={product}
                        key={product.id}
                        setProductsList={setProductsList}
                        handleRemoveProduct={handleRemoveProduct}
                        productList={products}
                      />
                    ))}
                  </div>
                ) : (
                  <p>Nennhum produto adicionado</p>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex justify-end gap-4">
              <Button type="button" size="sm" variant="destructive">
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={sendOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Enviando pedido...{' '}
                    <Send size={16} className="text-sm ml-1 animate-bounce" />
                  </>
                ) : (
                  <>
                    Enviar pedido <Send size={16} className="text-sm ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.query

  const apiClient = setupAPIClient(ctx)
  const getOrder = await apiClient.get<OrderById>(`/order/${id}`)
  const getCategories = await apiClient.get<Categories>('/category')
  const getProducts = await apiClient.get<ProductList>('/product/all')

  return {
    props: {
      orderDetails: getOrder.data,
      categories: getCategories.data,
      products: getProducts.data,
    },
  }
})
