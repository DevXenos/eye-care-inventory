import formatMoney from "../../../utils/formatMoney";
import formatQty from "../../../utils/formatQty";
import {
	LucideArchive,
	LucideArchiveRestore,
	LucideBarcode,
	LucideEye,
	LucideFolderArchive,
	LucidePen,
	LucidePlus,
} from "lucide-react";
import { ProductType } from "../../../types/ProductType";
import useProducts from "../../../hooks/useProducts";
import { toast } from "sonner";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import ProductView from "../../../components/View/ProductView";
import ProductForm from "../../../components/Form/ProductForm";
import outletStyles from "../../../constants/outletStyles";
import StyleSheet from "../../../utils/Stylesheet";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import { Ids } from "../../../constants/Ids";
import { useQuery } from "../../../context/QueryProvider";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
	Paper,
	IconButton,
	Stack,
} from "@mui/material";
import useStockHistory from "../../../hooks/useStockHistory";

type Order = "asc" | "desc";

const Inventory = () => {
	const { debouncedQuery } = useQuery();
	const { show } = useConfirmDialog();
	const { isLoading, products, setArchived, addProduct, updateProduct } = useProducts();
	const { addStockHistory } = useStockHistory();

	const [isArchivedOnly, setArchivedOnly] = useState<boolean>(false);
	const [showForm, setShowForm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
	const [viewProduct, setViewProduct] = useState<ProductType | null>(null);

	// Sorting state
	const [orderBy, setOrderBy] = useState<keyof ProductType>("created");
	const [order, setOrder] = useState<Order>("desc");

	// Toggle sorting on header click
	const handleSort = (property: keyof ProductType) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	// 🔹 Filter by archived toggle
	const visibleProducts = products.filter((item) =>
		isArchivedOnly ? item.archived : !item.archived
	);

	// 🔹 Apply search filter
	const searchedProducts = visibleProducts.filter((item) => {
		if (!debouncedQuery.trim()) return true;
		const q = debouncedQuery.toLowerCase();
		return (
			item.name.toLowerCase().includes(q) ||
			String(item.stock).includes(q) ||
			(item.expiry || "").toLowerCase().includes(q) ||
			String(item.costPrice || "").includes(q) ||
			String(item.sellPrice || "").includes(q)
		);
	});

	// 🔹 Sort data
	const sortedProducts = [...searchedProducts].sort((a, b) => {
		const asc = order === "asc";
		switch (orderBy) {
			case "created":
				return asc ? a.created - b.created : b.created - a.created;
			case "name":
				return asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			case "stock":
				return asc ? a.stock - b.stock : b.stock - a.stock;
			case "expiry":
				return asc
					? (a.expiry || "").localeCompare(b.expiry || "")
					: (b.expiry || "").localeCompare(a.expiry || "");
			case "costPrice":
				return asc ? (a.costPrice || 0) - (b.costPrice || 0) : (b.costPrice || 0) - (a.costPrice || 0);
			case "sellPrice":
				return asc ? (a.sellPrice || 0) - (b.sellPrice || 0) : (b.sellPrice || 0) - (a.sellPrice || 0);
			default:
				return 0;
		}
	});

	const handleSetArchive = (item: ProductType) => {
		const action = isArchivedOnly ? "unarchive" : "archive";
		const actionVerb = isArchivedOnly ? "Unarchiving" : "Archiving";
		const actionPast = isArchivedOnly ? "unarchived" : "archived";

		const handleAction = () => {
			toast.promise(setArchived(item.id, !isArchivedOnly), {
				id: Ids.toastArchived,
				loading: `${actionVerb} ${item.name}...`,
				success: `${item.name} has been ${actionPast}.`,
				error: `Failed to ${action} ${item.name}.`,
				finally: () => setViewProduct(null),
			});
		};

		show({
			title: isArchivedOnly ? "Unarchive Item?" : "Archive Item?",
			message: isArchivedOnly
				? `Are you sure you want to unarchive "${item.name}"?`
				: `Are you sure you want to archive "${item.name}"?`,
			confirmText: isArchivedOnly ? "Unarchive" : "Archive",
			dangerText: isArchivedOnly ? "Unarchive" : "Archive",
			...(isArchivedOnly ? { onDanger: handleAction } : { onConfirm: handleAction }),
		});
	};

	const handleEdit = (item: ProductType) => {
		setSelectedProduct(item);
		setShowForm(true);
	};

	const handleSave = async (product: Omit<ProductType, "id" | "created">) => {
		try {
			if (selectedProduct?.id) {
				await updateProduct(selectedProduct.id, product);
				toast.success("Product updated successfully!");
			} else {
				await addProduct(product);
				await addStockHistory({
					productName: product.name,
					stockAdjustment: product.stock,
					date: Date.now(),
				})
				toast.success("Product added successfully!");
			}
			setShowForm(false);
			setSelectedProduct(null);
		} catch (err) {
			console.error(err);
			toast.error("Failed to save product.");
		}
	};

	return (
		<Box>

			{/* Table Actions */}
			<Stack direction="row" justifyContent={'flex-end'} spacing={2} sx={{ mb: 2 }}>
				<Button variant="outlined" onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
					<LucidePlus size={18} /> Create Product
				</Button>

				<Button variant="outlined" href="/dashboard/generate-barcode">
					<LucideBarcode size={18} /> Generate Bar Code
				</Button>

				<Button variant="outlined" onClick={() => setArchivedOnly(!isArchivedOnly)}>
					<LucideFolderArchive size={18} />
					{isArchivedOnly ? "View Active" : "View Archived"}
				</Button>
			</Stack>

			{/* Product Table */}
			<TableContainer component={Paper}>
				<Typography variant="h6" sx={{ p: 2 }}>
					{isArchivedOnly ? "Archived Products" : "Product List"}
				</Typography>

				<Table>
					<TableHead>
						<TableRow>
							{[
								{ key: "name", label: "Name" },
								{ key: "stock", label: "Stock" },
								{ key: "expiry", label: "Expiration" },
								{ key: "costPrice", label: "Cost Price" },
								{ key: "sellPrice", label: "Sell Price" },
							].map((col) => (
								<TableCell key={col.key}>
									<TableSortLabel
										active={orderBy === col.key}
										direction={orderBy === col.key ? order : "asc"}
										onClick={() => handleSort(col.key as keyof ProductType)}
									>
										{col.label}
									</TableSortLabel>
								</TableCell>
							))}
							<TableCell align="center">Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={6} align="center">Loading...</TableCell>
							</TableRow>
						) : sortedProducts.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} align="center">No Products Found</TableCell>
							</TableRow>
						) : (
							sortedProducts.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.name}</TableCell>
									<TableCell>{formatQty(item.stock)}</TableCell>
									<TableCell>{item.expiry || "N/A"}</TableCell>
									<TableCell>{formatMoney(item.costPrice || 0, "₱")}</TableCell>
									<TableCell>{formatMoney(item.sellPrice || 0, "₱")}</TableCell>
									<TableCell align="center">
										<IconButton onClick={() => setViewProduct(item)} title="View">
											<LucideEye size={18} />
										</IconButton>
										<IconButton onClick={() => handleEdit(item)} title="Edit">
											<LucidePen size={18} />
										</IconButton>
										<IconButton onClick={() => handleSetArchive(item)} title={isArchivedOnly ? "Unarchive" : "Archive"}>
											{item.archived ? <LucideArchiveRestore size={18} /> : <LucideArchive size={18} />}
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<AnimatePresence>
				{showForm && (
					<MaterialDialog contentStyle={styles.form} closeOnEsc onClose={() => setShowForm(false)}>
						<ProductForm
							product={selectedProduct || undefined}
							onCancel={() => setShowForm(false)}
							onSave={handleSave}
						/>
					</MaterialDialog>
				)}

				{viewProduct && (
					<MaterialDialog closeOnClickOutside onClose={() => setViewProduct(null)}>
						<ProductView
							onEdit={(item) => { handleEdit(item); setViewProduct(null); }}
							onArchived={() => handleSetArchive(viewProduct)}
							product={viewProduct}
							onClose={() => setViewProduct(null)}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default Inventory;

const styles = StyleSheet.create({
	form: {
		maxWidth: 700,
		width: "90%",
	},
});
