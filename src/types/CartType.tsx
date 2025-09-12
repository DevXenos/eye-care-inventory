import { ProductType } from "./ProductType";

export type CartType = {
	time: number;
	productId: ProductType['id'];
	productName: string;
	productPrice: number;
	productImg: string;
	quantity: number;
};
