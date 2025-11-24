import { LucideEye, LucideFolderArchive, LucidePen, LucidePlus } from "lucide-react";
import * as React from "react";
import {
	Box,
	Button,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import SupplierForm from "../../../components/Form/SupplierForm";
import SupplierView from "../../../components/View/SupplierView";
import { SupplierType } from "../../../types/SupplierType";
import useSuppliers from "../../../hooks/useSuppliers";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import useArchivedToggle from "../../../hooks/utils/useArchivedToggle";
import ArchiveButtonIcon from "../../../components/material/ArchiveButtonIcon";
import { toast } from "sonner";
import { useQuery } from "../../../context/QueryProvider";

type Order = "asc" | "desc";
type SortKey = "id" | "shopName" | "contactPerson" | "phone" | "email";

const Suppliers: React.FC = () => {
	const { isLoading, suppliers, addSupplier, updateSupplier, setArchived } = useSuppliers();
	const { show } = useConfirmDialog();
	const { showArchived, toggleArchived, getArchivedButtonText } = useArchivedToggle();
	const { query } = useQuery();

	const [showForm, setShowForm] = React.useState(false);
	const [selectedSupplier, setSelectedSupplier] = React.useState<SupplierType | null>(null);
	const [viewSupplier, setViewSupplier] = React.useState<SupplierType | null>(null);

	// Sorting state
	const [orderBy, setOrderBy] = React.useState<SortKey>("id");
	const [order, setOrder] = React.useState<Order>("asc");

	const handleRequestSort = (property: SortKey) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	// Filter + sort
	const filteredSuppliers = suppliers
		.filter((s) => (s.archived ?? false) === showArchived)
		.filter((s) => {
			if (!query) return true;
			const lower = query.toLowerCase();
			return (
				s.shopName.toLowerCase().includes(lower) ||
				(s.contactPerson ?? "").toLowerCase().includes(lower) ||
				(s.email ?? "").toLowerCase().includes(lower)
			);
		})
		.slice()
		.sort((a, b) => {
			let cmp = 0;
			switch (orderBy) {
				case "id":
					cmp = String(a.id).localeCompare(String(b.id));
					break;
				case "shopName":
					cmp = a.shopName.localeCompare(b.shopName);
					break;
				case "contactPerson":
					cmp = (a.contactPerson ?? "").localeCompare(b.contactPerson ?? "");
					break;
				case "phone":
					cmp = a.phone.localeCompare(b.phone);
					break;
				case "email":
					cmp = (a.email ?? "").localeCompare(b.email ?? "");
					break;
			}
			return order === "asc" ? cmp : -cmp;
		});

	const handleSave = (supplier: SupplierType) => {
		const editMode = Boolean(selectedSupplier);

		if (editMode) {
			const id = selectedSupplier?.id;
			if (!id) return;

			toast.promise(updateSupplier(id, supplier), {
				loading: "Updating supplier...",
				success: () => {
					setShowForm(false);
					setSelectedSupplier(null);
					return "Supplier updated successfully!";
				},
				error: () => "Failed to update supplier.",
			});
		} else {
			toast.promise(addSupplier(supplier), {
				loading: "Adding supplier...",
				success: () => {
					setShowForm(false);
					return "Supplier added successfully!";
				},
				error: () => "Failed to add supplier.",
			});
		}
	};

	const handleArchive = (supplier: SupplierType) => {
		const handleAction = () => {
			if (!supplier.id) return;

			toast.promise(setArchived(supplier.id, !supplier.archived), {
				loading: supplier.archived ? "Unarchiving supplier..." : "Archiving supplier...",
				success: supplier.archived
					? `${supplier.shopName} supplier unarchived successfully!`
					: `${supplier.shopName} supplier archived successfully!`,
				error: supplier.archived ? "Failed to unarchive supplier." : "Failed to archive supplier.",
				finally() {
					setShowForm(false);
					setViewSupplier(null);
				},
			});
		};

		show({
			title: supplier.archived ? "Unarchive Supplier" : "Archive Supplier",
			message: supplier.archived
				? `Are you sure you want to unarchive "${supplier.shopName}"?`
				: `Are you sure you want to archive "${supplier.shopName}"?`,
			onConfirm: supplier.archived ? handleAction : undefined,
			onDanger: !supplier.archived ? handleAction : undefined,
			dangerText: "Archive",
			confirmText: "Unarchive",
		});
	};

	const handleEdit = (supplier: SupplierType) => {
		setViewSupplier(null);
		setShowForm(true);
		setSelectedSupplier(supplier);
	};

	return (
		<Box>
			<Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
				<Button
					variant="outlined"
					startIcon={<LucidePlus />}
					onClick={() => {
						setSelectedSupplier(null);
						setShowForm(true);
					}}
				>
					Create Supplier
				</Button>

				<Button
					variant="outlined"
					startIcon={<LucideFolderArchive />}
					onClick={toggleArchived}
				>
					{getArchivedButtonText()}
				</Button>
			</Stack>

			<Paper>
				<Typography variant="h6" p={2}>
					Suppliers List
				</Typography>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								{["id", "shopName", "contactPerson", "phone", "email"].map((key) => (
									<TableCell key={key}>
										<TableSortLabel
											active={orderBy === key}
											direction={orderBy === key ? order : "asc"}
											onClick={() => handleRequestSort(key as SortKey)}
										>
											{key.charAt(0).toUpperCase() + key.slice(1)}
										</TableSortLabel>
									</TableCell>
								))}
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{filteredSuppliers.length === 0 && !isLoading && (
								<TableRow>
									<TableCell colSpan={6} align="center">
										No Suppliers Found
									</TableCell>
								</TableRow>
							)}

							{filteredSuppliers.map((supplier) => (
								<TableRow key={supplier.id}>
									<TableCell>{supplier.id}</TableCell>
									<TableCell>{supplier.shopName}</TableCell>
									<TableCell>{supplier.contactPerson || "-"}</TableCell>
									<TableCell>{supplier.phone}</TableCell>
									<TableCell>{supplier.email || "-"}</TableCell>
									<TableCell align="right">
										<IconButton onClick={() => setViewSupplier(supplier)}>
											<LucideEye />
										</IconButton>
										<IconButton onClick={() => handleEdit(supplier)}>
											<LucidePen />
										</IconButton>
										<IconButton onClick={() => handleArchive(supplier)}>
											<ArchiveButtonIcon archived={supplier.archived} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			<AnimatePresence>
				{viewSupplier && (
					<MaterialDialog closeOnClickOutside closeOnEsc onClose={() => setViewSupplier(null)}>
						<SupplierView
							onArchive={handleArchive}
							onEdit={handleEdit}
							supplier={viewSupplier}
							onClose={() => setViewSupplier(null)}
						/>
					</MaterialDialog>
				)}

				{showForm && (
					<MaterialDialog
						contentStyle={{ maxWidth: 600, width: "90%" }}
						closeOnEsc
						onClose={() => setShowForm(false)}
					>
						<SupplierForm
							supplier={selectedSupplier}
							onCancel={() => setShowForm(false)}
							onSave={handleSave}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default Suppliers;
