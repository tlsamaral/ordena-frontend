import type { Categories } from "@/types/category";
import type { Product } from "@/types/product";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useState,
} from "react";

type GlobalContextData = {
	products: Product[];
	setProducts: Dispatch<SetStateAction<Product[]>>;
	categories: Categories;
	setCategories: Dispatch<SetStateAction<Categories>>;
};

type GlobalProviderProps = {
	children: ReactNode;
};

export const GlobalContext = createContext({} as GlobalContextData);

export function GlobalProvider({ children }: GlobalProviderProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Categories>([]);

	return (
		<GlobalContext.Provider
			value={{ products, setProducts, categories, setCategories }}
		>
			{children}
		</GlobalContext.Provider>
	);
}
