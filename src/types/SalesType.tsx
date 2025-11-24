import { CartType } from "./CartType";

export type SalesType = {
	id: string;
	date: number;
	customer: string;
	carts: CartType[];
	amount: number;
	archived?: boolean;
}