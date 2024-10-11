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
};

type GlobalProviderProps = {
	children: ReactNode;
};

export const GlobalContext = createContext({} as GlobalContextData);

export function GlobalProvider({ children }: GlobalProviderProps) {
	const [products, setProducts] = useState<Product[]>([]);

	return (
		<GlobalContext.Provider value={{ products, setProducts }}>
			{children}
		</GlobalContext.Provider>
	);
}
