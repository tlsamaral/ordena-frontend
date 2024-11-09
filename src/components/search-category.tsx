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
import { api } from '@/services/apiClient'
import type { Category } from '@/types/category'
import { Check, ChevronsUpDown, SendToBack } from 'lucide-react'

interface SearchCategoryProps {
  className?: string
  categories: Category[]
  onCategoryChange: (category: Category) => void
  categoryIdSelected: string
  setCategories?: React.Dispatch<React.SetStateAction<Category[]>>
  isRegister?: boolean
}

export function SearchCategory({
  categories,
  className,
  onCategoryChange,
  categoryIdSelected,
  setCategories,
  isRegister = true,
}: SearchCategoryProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const createNewCategory = async (label: string) => {
    try {
      const response = await api.post<Category>('/category', {
        name: searchValue,
      })
      if (setCategories) {
        setCategories([...categories, response.data])
      }
      onCategoryChange(response.data)
    } catch (err) {}
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between', className)}
        >
          {categoryIdSelected
            ? categories.find((category) => category.id === categoryIdSelected)
                ?.name
            : 'Selecione a categoria...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onValueChange={(val) => setSearchValue(val)}
            value={searchValue}
          />
          <CommandList>
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? "" : currentValue);
                    onCategoryChange(category)
                    setOpen(false)
                  }}
                >
                  {category.name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      categoryIdSelected === category.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
              {searchValue.length > 0 && isRegister && (
                <CommandItem
                  className="cursor-pointer"
                  onSelect={createNewCategory}
                  value={searchValue}
                >
                  Create "{searchValue}"{' '}
                  <SendToBack className="ml-2" size={16} />
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
