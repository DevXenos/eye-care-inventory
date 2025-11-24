import * as React from "react";
import { database } from "../config/firebaseConfig";
import { ref, onValue, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { PurchaseType } from "../types/PurchaseType";

const usePurchased = () => {
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [purchases, setPurchases] = React.useState<PurchaseType[]>([]);
	const [totalPurchased, setTotalPurchased] = React.useState<number>(0);

	React.useEffect(() => {
		const purchasesRef = ref(database, "purchases");

		const unsubscribe = onValue(purchasesRef, (snapshot) => {
			const data = snapshot.val() || {}; // default to empty object

			const loadedPurchases: PurchaseType[] = Object.entries(data).map(
				([id, purchase]) => ({
					...(purchase as Omit<PurchaseType, "id">),
					id,
				})
			);

			setPurchases(loadedPurchases);

			// Sum amounts safely
			const total = loadedPurchases.reduce(
				(sum, purchase) => sum + (purchase.amount ?? 0),
				0
			);
			setTotalPurchased(total);

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// Add a new purchase
	const addPurchase = async (purchase: PurchaseType) => {
		const id = uuidv4();
		const purchaseRef = ref(database, `purchases/${id}`);
		await set(purchaseRef, purchase);
	};

	// Update a purchase
	const updatePurchase = async (id: string, updates: Partial<PurchaseType>) => {
		const purchaseRef = ref(database, `purchases/${id}`);
		await update(purchaseRef, updates);
	};

	// Set archived status for a purchase
	const setArchived = async (id: string, archived: boolean) => {
		const purchaseRef = ref(database, `purchases/${id}`);
		await update(purchaseRef, { archived });
	};

	return {
		purchases,
		isLoading,
		totalPurchased,
		addPurchase,
		updatePurchase,
		setArchived,
	};
};

export default usePurchased;
