export interface ProductType {
	id?: number;
	name: string;
	category: string;
	type: string;
	brand: string;
	stock: number;
	expiry: string | null;
	costPrice: number;
	sellPrice: number;
	imgSrc: string;
	archived?: boolean;
	created: number;
}