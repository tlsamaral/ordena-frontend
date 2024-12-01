import type { Categories } from '@/types/category'
import type { Product } from '@/types/product'
import type { Table } from '@/types/table'
import type { User } from '@/types/user'
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useState,
} from 'react'

type GlobalContextData = {
	products: Product[]
	setProducts: Dispatch<SetStateAction<Product[]>>
	categories: Categories
	setCategories: Dispatch<SetStateAction<Categories>>
	users: User[]
	setUsers: Dispatch<SetStateAction<User[]>>
	tables: Table[]
	setTables: Dispatch<SetStateAction<Table[]>>
}

type GlobalProviderProps = {
	children: ReactNode
}

export const GlobalContext = createContext({} as GlobalContextData)

export function GlobalProvider({ children }: GlobalProviderProps) {
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Categories>([])
	const [users, setUsers] = useState<User[]>([])
	const [tables, setTables] = useState<Table[]>([])

	return (
		<GlobalContext.Provider
			value={{
				products,
				setProducts,
				categories,
				setCategories,
				users,
				setUsers,
				tables,
				setTables,
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}
