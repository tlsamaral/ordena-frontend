import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon, Trash } from 'lucide-react'
import type { ChangeEvent } from 'react'

interface ProductQuantityControlProps {
  quantity: number
  incrementQuantity: () => void
  decrementQuantity: () => void
  handleInputChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function ProductQuantityControl({
  quantity,
  decrementQuantity,
  incrementQuantity,
  handleInputChange,
}: ProductQuantityControlProps) {
  return (
    <div>
      <div className="flex justify-start items-center">
        <Button
          className="h-5 w-6 flex justify-center items-center p-0 rounded-none rounded-s-md"
          onClick={decrementQuantity}
        >
          {quantity === 1 ? (
            <Trash size={7} className="text-red-500" />
          ) : (
            <MinusIcon size={7} />
          )}
        </Button>
        <input
          type="text"
          className="h-6 w-8 px-1 text-center text-xs font-semibold focus:outline-none focus:ring-0"
          value={quantity}
          disabled
          onChange={handleInputChange}
        />
        <Button
          className="h-5 w-6 flex justify-center items-center p-0 rounded-none rounded-e-md"
          onClick={incrementQuantity}
        >
          <PlusIcon size={7} />
        </Button>
      </div>
    </div>
  )
}
