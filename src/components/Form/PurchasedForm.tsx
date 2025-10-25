import * as React from "react";
import { PurchaseProduct, PurchaseType } from "../../types/PurchaseType";
import {
	Box,
	Card,
	Typography,
	TextField,
	Button,
	MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import useProducts from "../../hooks/useProducts";
import useSuppliers from "../../hooks/useSuppliers";
import ProductCard from "../Card/ProductCard";
import { ProductType } from "../../types/ProductType";
import useStockHistory from "../../hooks/useStockHistory";
import usePurchased from "../../hooks/usePurchased";

type PurchaseFormProps = {
	purchase?: PurchaseType | null;
	onCancel?: () => void;
};

const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, onCancel }) => {
	const { products: storedProducts, addStock } = useProducts();
	const { suppliers } = useSuppliers();
	const { addStockHistory } = useStockHistory();
	const { addPurchase, updatePurchase } = usePurchased();

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
		const updated = [...products];

		// Clamp receivedQuantity so it cannot exceed ordered quantity
		if (key === "receivedQuantity") {
			const maxQty = updated[index].quantity;
			value = Math.min(Math.max(0, Number(value)), maxQty);
		}

		// Prevent editing completed purchase except receivedQuantity and price if status is Received
		if (isAlreadyReceived) {
			if (key === "quantity" || key === "id" || key === "name") {
				return toast.error("Cannot modify a completed purchase.", {
					id: "edit-product-error",
				});
			}
		}

		// Disable receivedQuantity & price if status is not Received
		if ((key === "receivedQuantity" || key === "price") && status !== "Received") {
			return;
		}

		updated[index] = { ...updated[index], [key]: value };
		setProducts(updated);
	};

	const removeProduct = (index: number) => {
		if (isAlreadyReceived) {
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
			toast.success(`${product.name} quantity updated`, {
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
		toast.success(`${product.name} added to purchase`, {
			id: "product-add/updated",
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Supplier required if editable
		if (!isAlreadyReceived && !supplier) return toast.error("Supplier is required.");

		// Must have at least one product
		if (products.length === 0) return toast.error("Please add at least one product.");

		// Validate each product
		for (const prod of products) {
			if (!isAlreadyReceived) {
				if (!prod.name || prod.name.trim() === "")
					return toast.error("Product name is required.");
				if (!prod.quantity || prod.quantity <= 0)
					return toast.error(`Quantity for ${prod.name} must be greater than 0.`);
			}
			if (status === "Received") {
				if (prod.price == null || prod.price < 0)
					return toast.error(`Price for ${prod.name} is required.`);
				if (prod.receivedQuantity == null || prod.receivedQuantity < 0)
					return toast.error(`Received quantity for ${prod.name} is required.`);
			}
		}

		// Calculate total amount
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
			if (!purchase) {
				await addPurchase(purchaseData);
				toast.success("Purchase added successfully!");
			} else {
				await updatePurchase(purchaseData.id, purchaseData);
				toast.info("Purchase edited successfully!");
			}

			if (isJustSetToReceived || status === "Received") {
				// Update stock & history
				await Promise.all(
					products.map(async (prod) => {
						const oldProd = purchase?.products.find((p) => p.id === prod.id);
						const oldQty = oldProd?.receivedQuantity ?? 0;
						const newQty = prod.receivedQuantity ?? prod.quantity ?? 0;
						const diff = newQty - oldQty;

						if (diff !== 0) {
							await addStock(prod.id, diff);
							await addStockHistory({
								date: Date.now(),
								productName: prod.name,
								stockAdjustment: diff,
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
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}
		>
			<Typography variant="h5" textAlign="center">
				{purchase ? "Edit Purchase" : "Add Purchase"}
			</Typography>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 3,
				}}
			>
				{/* Products selection */}
				{!purchase && (
					<Card sx={{ flex: 1, p: 2, minHeight: 300 }}>
						<Box
							component="ul"
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
								gap: 2,
								listStyle: "none",
								p: 0,
								m: 0,
							}}
						>
							{storedProducts.map((product) => (
								<Box component="li" key={product.id}>
									<ProductCard
										product={product}
										onClick={() => addProductFromCard(product)}
									/>
								</Box>
							))}
						</Box>
					</Card>
				)}

				{/* Purchase Details */}
				<Card
					sx={{
						flex: 1,
						p: 2,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						minHeight: 300,
					}}
				>
					<TextField
						select
						label="Supplier"
						value={supplier}
						onChange={(e) => setSupplier(e.target.value)}
						disabled={isAlreadyReceived}
						required={!isAlreadyReceived}
					>
						{suppliers.map((s, i) => (
							<MenuItem key={i} value={s.shopName}>
								{s.shopName}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Status"
						value={status}
						onChange={(e) =>
							setStatus(e.target.value as PurchaseType["status"])
						}
						disabled={isAlreadyReceived}
					>
						<MenuItem value="Pending">Pending</MenuItem>
						<MenuItem value="Sent">Sent</MenuItem>
						<MenuItem value="Received">Received</MenuItem>
					</TextField>

					<Typography variant="subtitle1">Selected Products</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						{products.map((product, index) => (
							<Box
								key={index}
								sx={{ display: "flex", gap: 1, alignItems: "center" }}
							>
								<Typography sx={{ flex: 1 }}>{product.name}</Typography>

								<TextField
									type="number"
									label="Ordered"
									value={product.quantity}
									onChange={(e) =>
										handleProductChange(index, "quantity", Number(e.target.value))
									}
									disabled={isAlreadyReceived}
									size="small"
									inputProps={{ min: 1 }}
									required={!isAlreadyReceived}
								/>

								<TextField
									type="number"
									label="Received"
									value={product.receivedQuantity ?? ""}
									onChange={(e) =>
										handleProductChange(
											index,
											"receivedQuantity",
											Number(e.target.value)
										)
									}
									disabled={status !== "Received"}
									size="small"
									inputProps={{
										min: 0,
										max: product.quantity,
									}}
									required={status === "Received"}
								/>

								<TextField
									type="number"
									label="Price"
									value={product.price}
									onChange={(e) =>
										handleProductChange(index, "price", Number(e.target.value))
									}
									disabled={status !== "Received"}
									size="small"
									required={status === "Received"}
								/>

								<Button
									variant="contained"
									color="error"
									onClick={() => removeProduct(index)}
									disabled={isAlreadyReceived}
								>
									X
								</Button>
							</Box>
						))}
					</Box>

					<Box
						sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: "auto" }}
					>
						{onCancel && (
							<Button variant="outlined" onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant="contained" type="submit">
							{purchase ? "Update Purchase" : "Add Purchase"}
						</Button>
					</Box>
				</Card>
			</Box>
		</Box>
	);
};

export default PurchaseForm;
