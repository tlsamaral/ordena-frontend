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
					className="h-6 w-6 rounded-full flex justify-center items-center p-0 "
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
					className="h-6 w-8 px-1 text-center text-sm font-semibold focus:outline-none focus:ring-0 bg-transparent"
					value={quantity}
					disabled
					onChange={handleInputChange}
				/>
				<Button
					className="h-6 w-6 rounded-full flex justify-center items-center p-0"
					onClick={incrementQuantity}
				>
					<PlusIcon size={7} />
				</Button>
			</div>
		</div>
	)
}
