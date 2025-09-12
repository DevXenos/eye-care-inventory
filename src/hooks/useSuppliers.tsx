import * as React from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../config/firebaseConfig";
import { SupplierType } from "../types/SupplierType";

const SUPPLIERS_PATH = "suppliers";

const useSuppliers = () => {
	const [suppliers, setSuppliers] = React.useState<SupplierType[]>([]);
	const [isLoading, setLoading] = React.useState(true);

	// Subscribe to supplier changes
	React.useEffect(() => {
		const suppliersRef = ref(database, SUPPLIERS_PATH);
		const unsubscribe = onValue(suppliersRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setSuppliers(Object.values(data));
			} else {
				setSuppliers([]);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// Add supplier
	const addSupplier = async (
		supplier: Omit<SupplierType, "id" | "archived" | "createdAt" | "updatedAt">
	) => {
		const nextId =
			suppliers.length > 0
				? Math.max(...suppliers.map((s) => s.id ?? 1000)) + 1
				: 1001;

		const newSupplier: SupplierType = {
			id: nextId,
			archived: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			...supplier,
		};

		await set(ref(database, `${SUPPLIERS_PATH}/${nextId}`), newSupplier);
	};

	// Update supplier
	const updateSupplier = async (id: number, supplier: SupplierType) => {
		const updated = { ...supplier, id, updatedAt: Date.now() };
		await set(ref(database, `${SUPPLIERS_PATH}/${id}`), updated);
	};

	// ✅ Set archived/unarchived
	const setArchived = async (id: number, archived: boolean) => {
		const supplier = suppliers.find((s) => s.id === id);
		if (!supplier) return;

		const updated = {
			...supplier,
			archived,
			updatedAt: Date.now(),
		};

		await set(ref(database, `${SUPPLIERS_PATH}/${id}`), updated);
	};

	return {
		suppliers,
		isLoading,
		addSupplier,
		updateSupplier,
		setArchived,
	};
};

export default useSuppliers;