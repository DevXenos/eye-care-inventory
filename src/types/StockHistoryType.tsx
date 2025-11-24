export type StockHistoryType = {
	id?: string;
	productName: string;
	stockAdjustment: number;
	date: number;
	archived?: boolean;
}