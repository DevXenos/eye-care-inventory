import { ProductType } from "./ProductType";

export type PurchaseProduct = {
	id: ProductType["id"];  // reference to the product
	name: string;           // store name at purchase time
	quantity: number;       // quantity purchased
	price: number;          // purchase price per unit
	receivedQuantity?: number;
};

export type PurchaseType = {
	id: string;                  // unique purchase ID
	date: number;                // timestamp of purchase
	supplier: string;            // supplier name
	status: "Pending" | "Sent" | "Received";
	products: PurchaseProduct[]; // list of products in the purchase
	amount: number;              // total amount of the purchase
	archived?: boolean;
};
