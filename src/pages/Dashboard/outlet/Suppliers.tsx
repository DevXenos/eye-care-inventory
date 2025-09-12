import Table from '../../../components/UI/Table/Table';
import {
	LucideArchive,
	LucideEye,
	LucideFilter,
	LucideFolderArchive,
	LucidePen,
	LucidePlus,
} from 'lucide-react';
import useSuppliers from '../../../hooks/useSuppliers';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MaterialDialog from '../../../components/material/MaterialDialog';
import SupplierForm from '../../../components/Form/SupplierForm';
import StyleSheet from '../../../utils/Stylesheet';
import AnimationButton from '../../../components/material/AnimationButton';
import outletStyles from '../../../constants/outletStyles';
import { SupplierType } from '../../../types/SupplierType';
import { toast } from 'sonner';
import SupplierView from '../../../components/View/SupplierView';
import { useConfirmDialog } from '../../../context/ConfirmDialogProvider';
import useArchivedToggle from '../../../hooks/utils/useArchivedToggle';
import ArchiveButtonIcon from '../../../components/material/ArchiveButtonIcon';

const Suppliers = () => {
	const { isLoading, suppliers, addSupplier, updateSupplier, setArchived } = useSuppliers();

	const { show } = useConfirmDialog()
	const { showArchived, toggleArchived, getArchivedButtonText } = useArchivedToggle()

	const [showForm, setShowForm] = useState(false); // hide initially
	const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null);

	// For Viewing Supplier
	const [viewSupplier, setViewSupplier] = useState<SupplierType | null>(null);

	const shownSupplier = suppliers
		.sort((a, b) => b.createdAt - a.createdAt)
		.filter((p) => (p.archived ?? false) === showArchived);

	const handleSave = (supplier: SupplierType) => {
		const editMode = Boolean(selectedSupplier);

		if (editMode) {
			// save function first
			const id = selectedSupplier?.id;
			if (!id) return;

			toast.promise(updateSupplier(id, supplier), {
				loading: "Updating supplier...",
				success: () => {
					setShowForm(false);
					setSelectedSupplier(null);
					return "Supplier updated successfully!";
				},
				error: (err) => {
					console.error(err);
					return "Failed to update supplier.";
				},
			});
		} else {
			toast.promise(addSupplier(supplier), {
				loading: "Adding supplier...",
				success: () => {
					setShowForm(false);
					return "Supplier added successfully!";
				},
				error: (err) => {
					console.error(err);
					return "Failed to add supplier.";
				},
			});
		}
	};

	const handleArchive = (supplier: SupplierType) => {
		const handleAction = () => {

			if (!supplier.id) return;

			toast.promise(
				setArchived(supplier.id, !supplier.archived),
				{
					loading: supplier.archived ? "Unarchiving supplier..." : "Archiving supplier...",
					success: supplier.archived
						? `${supplier.shopName} supplier unarchived successfully!`
						: `${supplier.shopName} supplier archived successfully!`,
					error: supplier.archived
						? "Failed to unarchive supplier."
						: "Failed to archive supplier.",
					finally() {
						setShowForm(false);
						setViewSupplier(null);
					},
				}
			);
		};

		show({
			title: supplier.archived ? "Unarchive Supplier" : "Archive Supplier",
			message: supplier.archived
				? `Are you sure you want to unarchive "${supplier.shopName}"?`
				: `Are you sure you want to archive "${supplier.shopName}"?`,
			onConfirm: supplier.archived ? handleAction : undefined,
			onDanger: !supplier.archived ? handleAction : undefined,
			dangerText: "Archive",
			confirmText: "Unarchive"
		});
	}

	const handleEdit = (supplier: SupplierType) => {
		setViewSupplier(null);
		setShowForm(true);
		setSelectedSupplier(supplier);
	}

	return (
		<div style={outletStyles.container}>
			<div style={outletStyles.tableActions}>
				<AnimationButton onClick={() => { setSelectedSupplier(null); setShowForm(true); }}>
					<LucidePlus />
					Create Supplier
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
				<h2 className="title">Suppliers List</h2>
				<Table
					isLoading={isLoading}
					emptyMessage='No Suppliers Found'
					headers={["ID", "Shop Name", "Contact", "Phone", "Email", ""]}
				>
					{shownSupplier.map((supplier) => (
						<tr key={supplier.id}>
							<td>{supplier.id}</td>
							<td>{supplier.shopName}</td>
							<td>{supplier.contactPerson || "-"}</td>
							<td>{supplier.phone}</td>
							<td>{supplier.email || "-"}</td>
							<td>
								<div className="actions">
									<button title="View" className="action" onClick={() => setViewSupplier(supplier)}>
										<LucideEye />
									</button>
									<button
										title="Edit Supplier"
										className="action"
										onClick={() => { setSelectedSupplier(supplier); setShowForm(true); }}
									>
										<LucidePen />
									</button>
									<button
										title={supplier.archived ? "Unarchive" : "Archive"}
										className="action"
										onClick={() => {
											handleArchive(supplier);
										}}
									>
										<ArchiveButtonIcon archived={supplier.archived} />
									</button>
								</div>
							</td>
						</tr>
					))}
				</Table>
			</div>

			<AnimatePresence>
				{viewSupplier && (
					<MaterialDialog closeOnClickOutside closeOnEsc onClose={() => setViewSupplier(null)}>
						<SupplierView onArchive={(supplier) => handleArchive(supplier)} onEdit={(supplier) => handleEdit(supplier)} supplier={viewSupplier} onClose={() => setViewSupplier(null)} />
					</MaterialDialog>
				)}

				{showForm && (
					<MaterialDialog contentStyle={styles.form} closeOnEsc onClose={() => setShowForm(false)}>
						<SupplierForm supplier={selectedSupplier} onCancel={() => setShowForm(false)} onSave={handleSave} />
					</MaterialDialog>
				)}

			</AnimatePresence>
		</div>
	);
};

export default Suppliers;

const styles = StyleSheet.create({
	form: {
		maxWidth: 600,
		width: "90%",
	}
});