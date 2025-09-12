import * as React from "react";
import { PurchaseProduct, PurchaseType } from "../../types/PurchaseType";
import Button from "../material/Button";
import StyleSheet from "../../utils/Stylesheet";
import { toast } from "sonner";
import useProducts from "../../hooks/useProducts";
import useSuppliers from "../../hooks/useSuppliers";
import ProductCard from "../Card/ProductCard";
import { ProductType } from "../../types/ProductType";

type PurchaseFormProps = {
	purchase?: PurchaseType | null; // if editing
	onSave: (purchase: PurchaseType) => void;
	onCancel?: () => void;
};

const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, onSave, onCancel }) => {
	const { products: storedProducts } = useProducts();
	const { suppliers } = useSuppliers();

	const [supplier, setSupplier] = React.useState(purchase?.supplier ?? "");
	const [status, setStatus] = React.useState<PurchaseType["status"]>(purchase?.status ?? "Pending");
	const [products, setProducts] = React.useState<PurchaseProduct[]>(purchase?.products ?? []);

	const handleProductChange = (index: number, key: keyof PurchaseProduct, value: any) => {

		if (purchase) {
			return toast.error("Cannot edit products from an existing purchase.", { id: "edit-product-error" });
		}

		const updated = [...products];
		updated[index] = { ...updated[index], [key]: value };
		setProducts(updated);
	};

	const removeProduct = (index: number) => {
		if (purchase) {
			return toast.error("Cannot remove products from an existing purchase.", { id: "remove-product-error" });
		}
		setProducts(products.filter((_, i) => i !== index));
	};

	const addProductFromCard = (product: ProductType) => {
		const existingIndex = products.findIndex((p) => p.id === product.id);
		if (existingIndex >= 0) {
			// Update quantity if product already exists
			const updated = [...products];
			updated[existingIndex].quantity += 1;
			setProducts(updated);
			toast.success(`${product.name} quantity updated`, { id: "product-updated" });
			return;
		}

		// Add new product
		setProducts((prev) => ([
			...prev,
			{
				id: product.id,
				name: product.name,
				quantity: 1,
				price: 0,
			}
		]));
		toast.success(`${product.name} added to purchase`, { id: "product-added" });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!supplier) {
			toast.error("Supplier is required.", { id: "supplier-error" });
			return;
		}
		if (products.length === 0) {
			toast.error("Please add at least one product.", { id: "no-product" });
			return;
		}

		const amount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

		onSave({
			id: purchase?.id ?? "",
			supplier,
			date: Date.now(),
			status,
			products,
			amount,
		});
	};

	return (
		<form style={styles.form} onSubmit={handleSubmit}>
			<h2 style={styles.title}>{purchase ? "Edit Purchase" : "Add Purchase"}</h2>

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

				{/* Purchase form */}
				<div style={styles.column}>
					<div style={styles.fieldGroup}>
						<label style={styles.label}>Supplier *</label>
						<select
							style={styles.input}
							value={supplier}
							onChange={(e) => setSupplier(e.target.value)}
							required
						>
							{suppliers.map((p, i) => (
								<option key={i} value={p.shopName} label={p.shopName} />
							))}
						</select>
					</div>

					<div style={styles.fieldGroup}>
						<label style={styles.label}>Status *</label>
						<select
							style={styles.input}
							value={status}
							onChange={(e) => setStatus(e.target.value as PurchaseType["status"])}
							disabled={purchase?.status === "Received"} // ❌ Disable if already received
						>
							<option value="Pending">Pending</option>
							<option value="Sent">Sent</option>
							<option value="Received">Received</option>
						</select>
					</div>

					<h3 style={styles.sectionTitle}>Selected Products</h3>
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
							/>

							<input
								style={styles.inputSmall}
								type="number"
								min={0}
								value={product.price}
								onChange={(e) =>
									handleProductChange(index, "price", Number(e.target.value))
								}
								required
							/>

							<Button variant="danger" type="button" onClick={() => removeProduct(index)}>
								X
							</Button>
						</div>
					))}

					<div style={styles.actions}>
						<Button type="submit">{purchase ? "Update Purchase" : "Add Purchase"}</Button>
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
