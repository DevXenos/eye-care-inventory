import * as React from "react";
import { ProductType } from "../types/ProductType";
import { database } from "../config/firebaseConfig";
import { ref, onValue, set, runTransaction, update } from "firebase/database";

const useProducts = () => {
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [products, setProducts] = React.useState<ProductType[]>([]);
	const [totalStocks, setTotalStocks] = React.useState<number>(0);

	React.useEffect(() => {
		const productsRef = ref(database, "products");

		const unsubscribe = onValue(productsRef, (snapshot) => {
			const data = snapshot.val();

			if (data) {
				const loadedProducts: ProductType[] = Object.entries(data).map(
					([id, product]) => ({
						id: Number(id),
						...(product as Omit<ProductType, "id">),
					})
				);
				setProducts(loadedProducts);

				// ✅ Compute total stock
				const total = loadedProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
				setTotalStocks(total);
			} else {
				setProducts([]);
				setTotalStocks(0);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const addProduct = async (product: Omit<ProductType, "id"|"created">) => {
		const existingIds = products.map(p => p.id).filter((id): id is number => id !== undefined);
		const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 80000001;

		const newProductRef = ref(database, `products/${nextId}`);
		await set(newProductRef, { ...product, id: nextId, created: Date.now() });
	};

	const addStock = async (id: ProductType["id"], amount: number) => {
		const stockRef = ref(database, `products/${id}/stock`);
		await runTransaction(stockRef, (currentStock) => {
			const stockNum = Number(currentStock || 0);
			return stockNum + amount;
		});
	};

	const updateProduct = async (
		id: ProductType["id"],
		updates: Partial<Omit<ProductType, "id">>
	) => {
		const productRef = ref(database, `products/${id}`);
		await update(productRef, updates);
	};

	const setArchived = async (
		id: ProductType["id"],
		archived: boolean
	) => {
		const productRef = ref(database, `products/${id}`);
		await update(productRef, { archived });
	};

	const getStockOf = (id: ProductType['id']) => {
		return products.find((prod) => {
			return prod.id === id;
		})?.stock;
	}

	return { products, isLoading, totalStocks, addProduct, addStock, updateProduct, setArchived, getStockOf };
};

export default useProducts;
