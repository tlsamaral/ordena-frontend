'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { ProductOrder } from '@/types/order'
import type { Product } from '@/types/product'
import { Check, ChevronsUpDown } from 'lucide-react'

interface SearchProductProps {
  className?: string
  products: Product[]
  productsListed: ProductOrder[]
  onProductChange: (product: Product) => void
  productIdSelected?: string
}

export function SearchProduct({
  products,
  className,
  onProductChange,
  productIdSelected,
  productsListed,
}: SearchProductProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between h-9', className)}
        >
          {productIdSelected
            ? products.find((product) => product.id === productIdSelected)?.name
            : 'Selecione um produto..'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Pesquise um produto..."
            className="h-9"
            onValueChange={(val) => setSearchValue(val)}
            value={searchValue}
          />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={(currentValue) => {
                    onProductChange(product)
                    setOpen(false)
                  }}
                  disabled={
                    !!productsListed.find(
                      (productListed) => productListed.id === product.id,
                    )
                  }
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {product.name}
                    </p>
                    <small className="text-xs text-zinc-900 dark:text-zinc-50">
                      {product.description}
                    </small>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      productsListed.find(
                        (productListed) => productListed.id === product.id,
                      )
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
