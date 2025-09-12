import { LucideArchive, LucideArchiveRestore, LucideEye, LucideFilter, LucideFolderArchive, LucidePen, LucidePlus, LucideView } from "lucide-react";
import * as React from "react";
import Table from "../../../components/UI/Table/Table";
import AnimationButton from "../../../components/material/AnimationButton";
import PurchaseForm from "../../../components/Form/PurchasedForm";
import MaterialDialog from "../../../components/material/MaterialDialog"; // your modal/dialog component
import { PurchaseType } from "../../../types/PurchaseType";
import { toast } from "sonner";
import usePurchased from "../../../hooks/usePurchased";
import { AnimatePresence } from "framer-motion";
import formatDate from "../../../utils/formatDate";
import formatMoney from "../../../utils/formatMoney";
import PurchaseView from "../../../components/View/PurchasedView";
import useProducts from "../../../hooks/useProducts";
import useStockHistory from "../../../hooks/useStockHistory";
import useArchivedToggle from "../../../hooks/utils/useArchivedToggle";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import ArchiveButtonIcon from "../../../components/material/ArchiveButtonIcon";

const Purchase: React.FC = () => {
	const { showArchived, toggleArchived, getArchivedButtonText } = useArchivedToggle();
	const { show } = useConfirmDialog();

	// Hooks
	const { isLoading, purchases, addPurchase, updatePurchase, setArchived } = usePurchased()
	const { addStock } = useProducts()
	const { addStockHistory } = useStockHistory()

	const [openForm, setOpenForm] = React.useState(false);
	const [editingPurchase, setEditingPurchase] = React.useState<PurchaseType | null>(null);

	const [viewPurchased, setViewPurchased] = React.useState<PurchaseType | null>(null);

	const filteredPurchased = purchases
		.sort((a, b) => b.date - a.date)
		.filter((p) => {
			return (p.archived ?? false) === showArchived;
		})

	const handleCreate = () => {
		setEditingPurchase(null); // new purchase
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);
		setEditingPurchase(null);
	};

	const handleSavePurchase = (purchase: PurchaseType, original?: PurchaseType) => {
		const isEditing = !!purchase.id;
		const promises: Promise<any>[] = [];

		if (isEditing) {
			promises.push(updatePurchase(purchase.id, purchase));

			// Use original to check if status changed
			if (original?.status !== "Received" && purchase.status === "Received") {
				purchase.products.forEach((p) => {
					promises.push(addStock(p.id, p.quantity));
					promises.push(
						addStockHistory({
							productName: p.name,
							stockAdjustment: p.quantity,
							date: Date.now(),
						})
					);
				});
			}
		} else {
			// New purchase
			promises.push(addPurchase(purchase));

			if (purchase.status === "Received") {
				purchase.products.forEach((p) => {
					promises.push(addStock(p.id, p.quantity));
					promises.push(
						addStockHistory({
							productName: p.name,
							stockAdjustment: p.quantity,
							date: Date.now(),
						})
					);
				});
			}
		}

		toast.promise(Promise.all(promises), {
			loading: `${isEditing ? "Updating" : "Adding"} purchase...`,
			success: `${isEditing ? "Updated" : "Added"} purchase for "${purchase.supplier}" successfully!`,
			error: `Failed to ${isEditing ? "update" : "add"} purchase. Please try again.`,
		});

		handleCloseForm();
	};

	// Handle archive function
	const handleArchive = (purchase: PurchaseType) => { 
		setViewPurchased(null);

		const handleAction = () => {
			setArchived(purchase.id, !purchase.archived);
		};

		show({
			title: purchase.archived ? "Unarchive Purchase" : "Archive Purchase",
			message: purchase.archived
				? `Are you sure you want to unarchive "${purchase.supplier}"?`
				: `Are you sure you want to archive "${purchase.supplier}"?`,
			onConfirm: purchase.archived ? handleAction : undefined,
			onDanger: !purchase.archived ? handleAction : undefined,
			dangerText: "Archive",
			confirmText: "Unarchive",
		});
	}

	const handleEdit = (purchase: PurchaseType) => {
		setViewPurchased(null);
		setEditingPurchase(purchase);
		setOpenForm(true); // open the form modal
	};
	
	return (
		<div className="outlet purchased-page">
			<div className="table-actions">
				<AnimationButton onClick={handleCreate}>
					<LucidePlus />
					Create Purchase
				</AnimationButton>

				<AnimationButton onClick={toggleArchived}>
					<LucideFolderArchive />
					{getArchivedButtonText()}
				</AnimationButton>

				<AnimationButton>
					<LucideFilter />
				</AnimationButton>
			</div>

			<div className="table-container">
				<h2 className="title">Purchased</h2>
				<Table isLoading={isLoading} headers={['Date', 'Supplier', 'Status', 'Amount', '']} emptyMessage="No Purchased Yet">
					{filteredPurchased.map((purchase) => (
						<tr key={purchase.id}>
							<td>{formatDate(purchase.date)}</td>
							<td>{purchase.supplier}</td>
							<td>{purchase.status}</td>
							<td>{formatMoney(purchase.amount, '₱')}</td>
							<td>
								<div className="actions">
									<button title="View" className="action" onClick={() => setViewPurchased(purchase)}>
										<LucideEye />
									</button>

									<button
										title="Edit"
										className="action"
										onClick={() => handleEdit(purchase)} // Use the handleEdit function
									>
										<LucidePen />
									</button>

									<button
										title={purchase.archived ? "Unarchive" : "Archive"}
										className="action"
										onClick={() => handleArchive(purchase)}
									>
										<ArchiveButtonIcon archived={purchase.archived} />
									</button>

								</div>
							</td>
						</tr>
					))}
				</Table>
			</div>

			{/* Modal for Purchase Form */}
			<AnimatePresence>
				{/* View */}
				{viewPurchased && (
					<MaterialDialog closeOnClickOutside closeOnEsc onClose={setViewPurchased}>
						<PurchaseView purchase={viewPurchased} onClose={() => setViewPurchased(null)} onEdit={(purchase) => handleEdit(purchase)} onArchive={(purchase) => handleArchive(purchase)} />
					</MaterialDialog>
				)}

				{/* Form */}
				{openForm && (
					<MaterialDialog contentStyle={{ minWidth: 700, width: editingPurchase ? "50%" : "100%", minHeight: "100%", borderRadius: 12 }} closeOnClickOutside={false} closeOnEsc onClose={handleCloseForm}>
						<PurchaseForm
							purchase={editingPurchase}
							onSave={handleSavePurchase}
							onCancel={handleCloseForm}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Purchase;
