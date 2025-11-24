import * as React from "react";
import { StockHistoryType } from "../types/StockHistoryType";
import { database } from "../config/firebaseConfig";
import { ref, onValue, set, push } from "firebase/database";

const useStockHistory = () => {
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [stockHistory, setStockHistory] = React.useState<StockHistoryType[]>([]);

	React.useEffect(() => {
		const historyRef = ref(database, "stockHistory");

		const unsubscribe = onValue(historyRef, (snapshot) => {
			const data = snapshot.val();

			if (data) {
				const loadedHistory: StockHistoryType[] = Object.entries(data).map(
					([id, history]) => ({
						id,
						...(history as Omit<StockHistoryType, "id">),
					})
				);
				setStockHistory(loadedHistory);
			} else {
				setStockHistory([]);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// ✅ Add stock history entry
	const addStockHistory = async (history: Omit<StockHistoryType, "id">) => {
		const historyRef = ref(database, "stockHistory");
		const newHistoryRef = push(historyRef);
		await set(newHistoryRef, history);
	};

	const archive = async (id: StockHistoryType['id'], archive: boolean) => {
		if (!id) return;

		const historyRef = ref(database, `stockHistory/${id}`);
		try {
			await set(historyRef, {
				...stockHistory.find((h) => h.id === id),
				archived: archive,
			});
		} catch (error) {
			console.error("Failed to update archive status:", error);
		}
	};

	return { stockHistory, isLoading, addStockHistory, archive };
};

export default useStockHistory;
