export interface Order {
	id: string;
	table: number;
	status: boolean;
	draft: boolean;
	name: string | null;
	created_at: Date | null;
	updated_at: Date | null;
	items: Item[];
}

export interface Item {
	amout: number;
	created_at: Date | null;
	id: string;
	order_id: string;
	product_id: string;
	updated_at: Date | null;
	product: ProductInfo;
}

export interface ProductInfo {
	name: string;
	banner: string;
}
