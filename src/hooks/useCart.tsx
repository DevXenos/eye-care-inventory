import { useState } from "react";
import { CartType } from "../types/CartType";
import { ProductType } from "../types/ProductType";

const useCart = () => {
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [carts, setCarts] = useState<CartType[]>([]);

	const recalcTotal = (items: CartType[]) => {
		const total = items.reduce(
			(sum, item) => sum + item.productPrice * item.quantity,
			0
		);
		setTotalPrice(total);
	};

	const addItem = (cart: CartType) => {
		setCarts((prev) => {
			const existing = prev.find((c) => c.productId === cart.productId);

			let updated: CartType[];
			if (existing) {
				updated = prev.map((c) =>
					c.productId === cart.productId
						? { ...c, quantity: c.quantity + cart.quantity }
						: c
				);
			} else {
				updated = [...prev, cart];
			}

			recalcTotal(updated);
			return updated;
		});
	};

	const updateQuantity = (productId: ProductType['id'], quantity: number) => {
		setCarts((prev) => {
			const updated = prev.map((c) =>
				c.productId === productId
					? { ...c, quantity: Math.max(1, quantity) }
					: c
			);
			recalcTotal(updated);
			return updated;
		});
	};

	const removeItem = (productId: ProductType['id']) => {
		setCarts((prev) => {
			const updated = prev.filter((c) => c.productId !== productId);
			recalcTotal(updated);
			return updated;
		});
	};

	// ✅ Reset cart completely
	const resetCart = () => {
		setCarts([]);
		setTotalPrice(0);
	};

	return {
		totalPrice,
		carts,
		addItem,
		updateQuantity,
		removeItem,
		resetCart, // added here
	};
};

export default useCart;
