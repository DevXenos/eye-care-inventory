import formatMoney from "../../../utils/formatMoney";
import Table from "../../../components/UI/Table/Table";
import formatQty from "../../../utils/formatQty";
import {
	LucideArchive,
	LucideArchiveRestore,
	LucideBarcode,
	LucideEye,
	LucideFilter,
	LucideFolderArchive,
	LucidePen,
	LucidePlus,
} from "lucide-react";
import { ProductType } from "../../../types/ProductType";
import useProducts from "../../../hooks/useProducts";
import { toast } from "sonner";
import { useState } from "react";
import AnimationButton from "../../../components/material/AnimationButton";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import ProductView from "../../../components/View/ProductView";
import ProductForm from "../../../components/Form/ProductForm";
import outletStyles from "../../../constants/outletStyles";
import StyleSheet from "../../../utils/Stylesheet";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import { Ids } from "../../../constants/Ids";
import { useSortDialog } from "../../../context/SortDialogProvider";

const sortSelection = ["Date", "Name", "Stock", "Expiry", "Cost Price", "Sell Price"];

const Inventory = () => {
	const { show } = useConfirmDialog();
	const { openSortingDialog } = useSortDialog();
	const { isLoading, products, setArchived, addProduct, updateProduct } = useProducts();

	const [isArchivedOnly, setArchivedOnly] = useState<boolean>(false);
	const [showForm, setShowForm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
	const [viewProduct, setViewProduct] = useState<ProductType | null>(null);

	// Sorting state
	const [sortOption, setSortOption] = useState<(typeof sortSelection)[number]>('Date');
	const [sortAsc, setSortAsc] = useState(true);

	// Filtered products based on archive
	const visibleProducts = products.filter((item) => (isArchivedOnly ? item.archived : !item.archived));

	// Sorted products
	const sortedProducts = [...visibleProducts].sort((a, b) => {
		if (!sortOption) return 0;

		switch (sortOption) {
			case 'Date':
				return sortAsc ? b.created - a.created : a.created - b.created;
			case "Name":
				return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			case "Stock":
				return sortAsc ? a.stock - b.stock : b.stock - a.stock;
			case "Expiry":
				return sortAsc
					? (a.expiry || "").localeCompare(b.expiry || "")
					: (b.expiry || "").localeCompare(a.expiry || "");
			case "Cost Price":
				return sortAsc ? (a.costPrice || 0) - (b.costPrice || 0) : (b.costPrice || 0) - (a.costPrice || 0);
			case "Sell Price":
				return sortAsc ? (a.sellPrice || 0) - (b.sellPrice || 0) : (b.sellPrice || 0) - (a.sellPrice || 0);
			default:
				return 0;
		}
	});

	const handleSetArchive = (item: ProductType) => {
		const action = isArchivedOnly ? "unarchive" : "archive";
		const actionVerb = isArchivedOnly ? "Unarchiving" : "Archiving";
		const actionPast = isArchivedOnly ? "unarchived" : "archived";

		const handleAction = () => {
			toast.promise(
				setArchived(item.id, !isArchivedOnly),
				{
					id: Ids.toastArchived,
					loading: `${actionVerb} ${item.name}...`,
					success: `${item.name} has been ${actionPast}.`,
					error: `Failed to ${action} ${item.name}.`,
					finally: () => {
						setViewProduct(null);
					}
				}
			);
		};

		show({
			title: isArchivedOnly ? "Unarchive Item?" : "Archive Item?",
			message: isArchivedOnly
				? `Are you sure you want to unarchive "${item.name}"? It will be restored to the active list.`
				: `Are you sure you want to archive "${item.name}"? It will be moved to the archived list and hidden from active view.`,
			confirmText: isArchivedOnly ? "Unarchive" : "Archive",
			dangerText: isArchivedOnly ? "Unarchive" : "Archive",
			...isArchivedOnly
				? { onDanger: handleAction }
				: { onConfirm: handleAction },
		});
	}

	const handleEdit = (item: ProductType) => {
		setSelectedProduct(item);
		setShowForm(true);
	}

	const handleSave = async (product: Omit<ProductType, "id" | "created">) => {
		try {
			if (selectedProduct?.id) {
				await updateProduct(selectedProduct.id, product);
				toast.success("Product updated successfully!");
			} else {
				await addProduct(product);
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
		<div style={outletStyles.container}>
			{/* Table Actions */}
			<div style={outletStyles.tableActions}>
				<AnimationButton onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
					<LucidePlus />
					Create Product
				</AnimationButton>

				<AnimationButton to="../generate-barcode">
					<LucideBarcode />
					Generate Bar Code
				</AnimationButton>

				<AnimationButton onClick={() => setArchivedOnly(!isArchivedOnly)}>
					<LucideFolderArchive />
					{isArchivedOnly ? "View Active" : "View Archived"}
				</AnimationButton>

				<AnimationButton onClick={() =>
					openSortingDialog(
						sortSelection,
						sortOption,
						(options, selected) => {
							if (sortOption === selected) {
								setSortAsc(!sortAsc); // toggle direction
							} else {
								setSortOption(selected);
								setSortAsc(true); // default ascending
							}
						}
					)
				}>
					<LucideFilter />
					{sortOption ? ` ${sortOption} (${sortAsc ? "↑" : "↓"})` : ""}
				</AnimationButton>
			</div>

			{/* Product Table */}
			<div className="table-container">
				<h2 className="title">{isArchivedOnly ? "Archived Products" : "Product List"}</h2>
				<Table
					isLoading={isLoading}
					emptyMessage="No Products Found"
					headers={["Name", "Stock", "Expiration", "Cost Price", "Sell Price", ""]}
				>
					{sortedProducts.map((item: ProductType) => (
						<tr key={item.id}>
							<td>{item.name}</td>
							<td>{formatQty(item.stock)}</td>
							<td>{item?.expiry || "N/A"}</td>
							<td>{formatMoney(item?.costPrice || 0, "₱")}</td>
							<td>{formatMoney(item?.sellPrice || 0, "₱")}</td>
							<td>
								<div className="actions">
									<button title="View" className="action" onClick={() => setViewProduct(item)}>
										<LucideEye />
									</button>

									<button title="Edit" className="action" onClick={() => handleEdit(item)}>
										<LucidePen />
									</button>

									<button
										title={isArchivedOnly ? "Unarchive" : "Archive"}
										className="action"
										onClick={() => handleSetArchive(item)}
									>
										{item.archived ? <LucideArchiveRestore /> : <LucideArchive />}
									</button>
								</div>
							</td>
						</tr>
					))}
				</Table>
			</div>

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
							onEdit={(item) => {
								handleEdit(item);
								setViewProduct(null);
							}}
							onArchived={() => handleSetArchive(viewProduct)} product={viewProduct} onClose={() => setViewProduct(null)} />
					</MaterialDialog>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Inventory;

const styles = StyleSheet.create({
	form: {
		maxWidth: 700,
		width: "90%",
	},
});
