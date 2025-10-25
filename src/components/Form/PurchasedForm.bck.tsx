import * as React from "react";
import { PurchaseProduct, PurchaseType } from "../../types/PurchaseType";
import Button from "../material/Button";
import StyleSheet from "../../utils/Stylesheet";
import { toast } from "sonner";
import useProducts from "../../hooks/useProducts";
import useSuppliers from "../../hooks/useSuppliers";
import ProductCard from "../Card/ProductCard";
import { ProductType } from "../../types/ProductType";
import useStockHistory from "../../hooks/useStockHistory";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../config/firebaseConfig";
import usePurchased from "../../hooks/usePurchased";

type PurchaseFormProps = {
	purchase?: PurchaseType | null;
	onCancel?: () => void;
};

const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, onCancel }) => {
	const { products: storedProducts, addStock } = useProducts();
	const { suppliers } = useSuppliers();
	const { addStockHistory } = useStockHistory();
	const { addPurchase, updatePurchase } = usePurchased()

	const [supplier, setSupplier] = React.useState(purchase?.supplier ?? "");
	const [status, setStatus] = React.useState<PurchaseType["status"]>(
		purchase?.status ?? "Pending"
	);
	const [products, setProducts] = React.useState<PurchaseProduct[]>(
		purchase?.products ?? []
	);

	const isAlreadyReceived = purchase?.status === "Received";
	const isJustSetToReceived = status === "Received" && !isAlreadyReceived;

	const handleProductChange = (
		index: number,
		key: keyof PurchaseProduct,
		value: any
	) => {
		if (isAlreadyReceived && !isJustSetToReceived) {
			return toast.error("Cannot modify a completed purchase.", {
				id: "edit-product-error",
			});
		}
		const updated = [...products];
		updated[index] = { ...updated[index], [key]: value };
		setProducts(updated);
	};

	const removeProduct = (index: number) => {
		if (isAlreadyReceived && !isJustSetToReceived) {
			return toast.error("Cannot remove from a completed purchase.", {
				id: "remove-product-error",
			});
		}
		setProducts(products.filter((_, i) => i !== index));
	};

	const addProductFromCard = (product: ProductType) => {
		const existingIndex = products.findIndex((p) => p.id === product.id);
		if (existingIndex >= 0) {
			const updated = [...products];
			updated[existingIndex].quantity += 1;
			setProducts(updated);
			toast.success(`${ product.name } quantity updated`, {
				id: "product-add/updated",
			});
			return;
		}

		setProducts((prev) => [
			...prev,
			{
				id: product.id,
				name: product.name,
				quantity: 1,
				price: 0,
			},
		]);
		toast.success(`${ product.name } added to purchase`, {
			id: "product-add/updated",
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!supplier) return toast.error("Supplier is required.");
		if (products.length === 0)
			return toast.error("Please add at least one product.");

		const amount = products.reduce(
			(sum, p) => sum + p.price * (p.receivedQuantity ?? p.quantity),
			0
		);

		const purchaseData: PurchaseType = {
			id: purchase?.id ?? "",
			supplier,
			date: Date.now(),
			status,
			products,
			amount,
		};

		try {
			// ✅ Only add to Firestore if creating new purchase
			if (!purchase) {
				await addPurchase(purchaseData);
				toast.success("Purchase added successfully!");
			} else {
				await updatePurchase(
					purchaseData.id,
					purchaseData
				)
				toast.info("Purchase edited successfully!");
			}

			// ✅ Update inventory if just received
			if (isJustSetToReceived) {
				await Promise.all(
					products.map(async (prod) => {
						const qty = prod.receivedQuantity ?? prod.quantity ?? 0;
						if (qty > 0) {
							await addStock(prod.id, qty);
							await addStockHistory({
								date: Date.now(),
								productName: prod.name,
								stockAdjustment: qty,
							});
						}
					})
				);
				toast.success("Inventory updated successfully!");
			}

			if (onCancel) onCancel();
		} catch (err) {
			console.error(err);
			toast.error("Failed to save purchase.");
		}
	};

	return (
		<form style={styles.form} onSubmit={handleSubmit}>
			<h2 style={styles.title}>
				{purchase ? "Edit Purchase" : "Add Purchase"}
			</h2>

			<div style={styles.content}>
				{!purchase && (
					<div style={styles.column}>
						<h3 style={styles.sectionTitle}>Select Products</h3>
						<div style={styles.productsGrid}>
							{storedProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onClick={() => addProductFromCard(product)}
								/>
							))}
						</div>
					</div>
				)}

				<div style={styles.column}>
					<div style={styles.fieldGroup}>
						<label style={styles.label}>Supplier *</label>
						<select
							style={{ ...styles.input, cursor: "pointer" }}
							value={supplier}
							onChange={(e) => setSupplier(e.target.value)}
							required
							disabled={isAlreadyReceived}
						>
							<option value="">Select Supplier</option>
							{suppliers.map((p, i) => (
								<option key={i} value={p.shopName} label={p.shopName} />
							))}
						</select>
					</div>

					<div style={styles.fieldGroup}>
						<label style={styles.label}>Status *</label>
						<select
							style={{
								...styles.input,
								cursor: isAlreadyReceived ? "not-allowed" : "pointer",
							}}
							value={status}
							onChange={(e) =>
								setStatus(e.target.value as PurchaseType["status"])
							}
							disabled={isAlreadyReceived}
						>
							<option value="Pending">Pending</option>
							<option value="Sent">Sent</option>
							<option value="Received">Received</option>
						</select>
					</div>

					<h3 style={styles.sectionTitle}>Selected Products</h3>

					<div style={{ ...styles.productRow, fontWeight: 600, color: "#444" }}>
						<span style={{ flex: 1 }}>Product</span>
						<span style={{ flex: 1 }}>Ordered Qty</span>
						<span style={{ flex: 1 }}>Received Qty</span>
						<span style={{ flex: 1 }}>Price</span>
						<span style={{ width: 40 }}>Action</span>
					</div>

					{products.map((product, index) => (
						<div key={index} style={styles.productRow}>
							<span style={{ flex: 1 }}>{product.name}</span>

							<input
								style={styles.inputSmall}
								type="number"
								min={1}
								value={product.quantity}
								onChange={(e) =>
									handleProductChange(index, "quantity", Number(e.target.value))
								}
								required
								disabled={isAlreadyReceived && !isJustSetToReceived}
							/>

							<input
								style={styles.inputSmall}
								type="number"
								min={0}
								value={product.receivedQuantity ?? ""}
								onChange={(e) =>
									handleProductChange(
										index,
										"receivedQuantity",
										Number(e.target.value)
									)
								}
								placeholder="Received Quantity"
								disabled={!isJustSetToReceived}
							/>

							<input
								style={styles.inputSmall}
								type="number"
								min={0}
								value={product.price}
								onChange={(e) =>
									handleProductChange(index, "price", Number(e.target.value))
								}
								placeholder="Price"
								disabled={!isJustSetToReceived}
							/>

							<Button
								variant="danger"
								type="button"
								onClick={() => removeProduct(index)}
								disabled={isAlreadyReceived && !isJustSetToReceived}
							>
								X
							</Button>
						</div>
					))}

					<div style={styles.actions}>
						<Button type="submit">
							{purchase ? "Update Purchase" : "Add Purchase"}
						</Button>
						{onCancel && (
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
						)}
					</div>
				</div>
			</div>
		</form>
	);
};

export default PurchaseForm;

const styles = StyleSheet.create({
	form: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		gap: 20,
		padding: 32,
		background: "#fff",
		borderRadius: 16,
	},
	title: {
		margin: 0,
		fontSize: 22,
		fontWeight: 700,
		color: "#111",
		textAlign: "center",
	},
	content: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
		flexWrap: "wrap",
		gap: 12,
	},
	column: {
		flex: 1,
		minWidth: 600,
		display: "flex",
		flexDirection: "column",
		gap: 12,
	},
	productsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
		gap: 16,
		width: "100%",
	},
	fieldGroup: {
		display: "flex",
		flexDirection: "column",
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: 500,
		color: "#333",
	},
	sectionTitle: {
		color: "#007bff",
		margin: "20px 0 10px",
		fontSize: 18,
		textTransform: "uppercase",
		letterSpacing: 1,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	productRow: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	input: {
		padding: "10px 12px",
		borderRadius: 8,
		border: "1px solid #ddd",
		fontSize: 15,
		transition: "all 0.2s",
	},
	inputSmall: {
		flex: 1,
		padding: "8px 10px",
		borderRadius: 8,
		border: "1px solid #ddd",
		fontSize: 14,
	},
	actions: {
		display: "flex",
		gap: 12,
		marginTop: "auto",
	},
});