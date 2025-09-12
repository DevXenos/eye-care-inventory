import * as React from "react";
import { SalesType } from "../types/SalesType";
import { database } from "../config/firebaseConfig";
import { ref, onValue, set, update, runTransaction } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const useSalesReport = () => {
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [salesReport, setSalesReport] = React.useState<SalesType[]>([]);
	const [totalSales, setTotalSales] = React.useState<number>(0);

	React.useEffect(() => {
		const salesRef = ref(database, "sales");

		const unsubscribe = onValue(salesRef, (snapshot) => {
			const data = snapshot.val();

			if (data) {
				const loadedSales: SalesType[] = Object.entries(data).map(
					([id, sale]) => ({
						id,
						...(sale as Omit<SalesType, "id">),
					})
				);
				setSalesReport(loadedSales);

				const total = loadedSales.reduce(
					(sum, sale) => sum + (sale.amount || 0),
					0
				);
				setTotalSales(total);
			} else {
				setSalesReport([]);
				setTotalSales(0);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const addSale = async (sale: Omit<SalesType, "id">) => {
		const id = uuidv4();
		const saleRef = ref(database, `sales/${id}`);
		await set(saleRef, sale);
	};

	const updateSale = async (id: string, updates: Partial<Omit<SalesType, "id">>) => {
		const saleRef = ref(database, `sales/${id}`);
		await update(saleRef, updates);
	};

	const addQuantity = async (id: string, amount: number) => {
		const quantityRef = ref(database, `sales/${id}/quantity`);
		await runTransaction(quantityRef, (currentQty) => {
			if (currentQty === null) return amount;
			return currentQty + amount;
		});
	};

	// New function to toggle archived state
	const setArchived = async (id: string, archived: boolean) => {
		const saleRef = ref(database, `sales/${id}`);
		await update(saleRef, { archived });
	};

	return {
		salesReport,
		isLoading,
		totalSales,
		addSale,
		updateSale,
		addQuantity,
		setArchived, // return the new function
	};
};

export default useSalesReport;
