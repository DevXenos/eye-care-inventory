import {
	LucideEye,
	LucideFolderArchive,
	LucidePen,
	LucidePlus,
} from "lucide-react";
import * as React from "react";
import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	TableSortLabel,
	Stack,
} from "@mui/material";
import PurchaseForm from "../../../components/Form/PurchasedForm";
import MaterialDialog from "../../../components/material/MaterialDialog";
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
import { useQuery } from "../../../context/QueryProvider";

// Sorting keys
type Order = "asc" | "desc";
type SortKey = "date" | "supplier" | "status" | "amount";

const Purchase: React.FC = () => {
	const { showArchived, toggleArchived, getArchivedButtonText } =
		useArchivedToggle();
	const { show } = useConfirmDialog();
	const { query } = useQuery();

	// Hooks
	const { isLoading, purchases, addPurchase, updatePurchase, setArchived } =
		usePurchased();
	const { addStock } = useProducts();
	const { addStockHistory } = useStockHistory();

	const [openForm, setOpenForm] = React.useState(false);
	const [editingPurchase, setEditingPurchase] =
		React.useState<PurchaseType | null>(null);
	const [viewPurchased, setViewPurchased] =
		React.useState<PurchaseType | null>(null);

	// Sorting state
	const [orderBy, setOrderBy] = React.useState<SortKey>("date");
	const [order, setOrder] = React.useState<Order>("desc");

	const handleRequestSort = (property: SortKey) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	// Filter + sort
	const filteredPurchased = purchases
		.filter((p) => {
			if (!query) return true;
			const search = query.toLowerCase();

			return (
				p.supplier.toLowerCase().includes(search) ||
				p.status.toLowerCase().includes(search) ||
				String(p.amount).toLowerCase().includes(search) ||
				p.products.some((prod) =>
					prod.name.toLowerCase().includes(search)
				)
			);
		})
		.filter((p) => (p.archived ?? false) === showArchived)
		.slice()
		.sort((a, b) => {
			let cmp = 0;
			switch (orderBy) {
				case "date":
					cmp = a.date - b.date;
					break;
				case "supplier":
					cmp = a.supplier.localeCompare(b.supplier);
					break;
				case "status":
					cmp = a.status.localeCompare(b.status);
					break;
				case "amount":
					cmp = a.amount - b.amount;
					break;
			}
			return order === "asc" ? cmp : -cmp;
		});

	// Handlers
	const handleCreate = () => {
		setEditingPurchase(null);
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);
		setEditingPurchase(null);
	};

	const handleSavePurchase = (
		purchase: PurchaseType,
		original?: PurchaseType
	) => {
		const isEditing = !!purchase.id;
		const promises: Promise<any>[] = [];

		if (!isEditing) {
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
	};

	const handleEdit = (purchase: PurchaseType) => {
		setViewPurchased(null);
		setEditingPurchase(purchase);
		setOpenForm(true);
	};

	return (
		<Box>
			<Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
				<Button
					variant="outlined"
					startIcon={<LucidePlus />}
					onClick={handleCreate}
				>
					Create Purchase
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
					Purchases
				</Typography>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								{["date", "supplier", "status", "amount"].map((key) => (
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
							{filteredPurchased.length === 0 && !isLoading && (
								<TableRow>
									<TableCell colSpan={5} align="center">
										No Purchases Yet
									</TableCell>
								</TableRow>
							)}

							{filteredPurchased.map((purchase) => (
								<TableRow key={purchase.id}>
									<TableCell>{formatDate(purchase.date)}</TableCell>
									<TableCell>{purchase.supplier}</TableCell>
									<TableCell>{purchase.status}</TableCell>
									<TableCell>{formatMoney(purchase.amount, "₱")}</TableCell>
									<TableCell align="right">
										<IconButton onClick={() => setViewPurchased(purchase)}>
											<LucideEye />
										</IconButton>
										<IconButton onClick={() => handleEdit(purchase)}>
											<LucidePen />
										</IconButton>
										<IconButton onClick={() => handleArchive(purchase)}>
											<ArchiveButtonIcon archived={purchase.archived} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			<AnimatePresence>
				{viewPurchased && (
					<MaterialDialog
						closeOnClickOutside
						closeOnEsc
						onClose={setViewPurchased}
					>
						<PurchaseView
							purchase={viewPurchased}
							onClose={() => setViewPurchased(null)}
							onEdit={(purchase) => handleEdit(purchase)}
							onArchive={(purchase) => handleArchive(purchase)}
						/>
					</MaterialDialog>
				)}

				{openForm && (
					<MaterialDialog
						contentStyle={{
							minWidth: 700,
							width: editingPurchase ? "60%" : "100%",
							minHeight: "100%",
							borderRadius: 12,
						}}
						closeOnClickOutside={false}
						closeOnEsc
						onClose={handleCloseForm}
					>
						<PurchaseForm
							purchase={editingPurchase}
							// onSave={handleSavePurchase}
							onCancel={handleCloseForm}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default Purchase;
