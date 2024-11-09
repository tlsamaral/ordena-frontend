import type { ProductOrder } from '@/types/order'
import type { ProductList } from '@/types/product'
import { formatValueToMoney } from '@/utils/formatCurrency'
import ProductQuantityControl from './product-quantity-control'
import { Button } from './ui/button'

interface ProductCellProps {
  product: ProductOrder
  productList: ProductList
  setProductsList: React.Dispatch<React.SetStateAction<ProductOrder[]>>
  handleRemoveProduct: (product_id: string) => void
}
export default function ProductCell({
  product,
  productList: products,
  setProductsList,
  handleRemoveProduct,
}: ProductCellProps) {
  const productFound = products.find((p) => p.id === product.id)
  if (!productFound) {
    return null
  }

  const incrementQuantity = () => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return { ...p, amount: p.amount + 1 }
        }
        return p
      }),
    )
  }

  const decrementQuantity = () => {
    setProductsList((prev) => {
      const productFoundIndex = prev.findIndex((p) => p.id === product.id)
      if (productFoundIndex === -1) {
        return prev
      }

      const newPrev = [...prev]

      if (newPrev[productFoundIndex].amount === 1) {
        return newPrev.filter((p) => p.id !== product.id)
      }

      newPrev[productFoundIndex].amount--

      return newPrev
    })
  }

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <section className="flex flex-row items-center gap-2">
        <div className="h-12 w-1h-12 rounded-full border overflow-hidden">
          <img
            src={
              products.find((p) => p.id === product.id)?.banner ||
              '/product-base.webp'
            }
            alt={product.name}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col justify-start gap-1">
          <p className="text-sm font-semibold">{product.name}</p>
          <ProductQuantityControl
            quantity={product.amount}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        </div>
      </section>
      <div>
        <p className="text-sm font-semibold">
          {formatValueToMoney(product.price)}
        </p>
        <Button
          variant="link"
          size="sm"
          className="px-0 text-right"
          onClick={() => handleRemoveProduct(product.id)}
        >
          Remover
        </Button>
      </div>
    </div>
  )
}
