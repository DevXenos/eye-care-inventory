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
import {
	LucideArchive,
	LucideArchiveRestore,
	LucideFolderArchive,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import { useQuery } from "../../../context/QueryProvider";
import useStockHistory from "../../../hooks/useStockHistory";
import { StockHistoryType } from "../../../types/StockHistoryType";
import formatDate from "../../../utils/formatDate";
import formatQty from "../../../utils/formatQty";

type Order = "asc" | "desc";
type OrderBy = "productName" | "stockAdjustment" | "date";

const StockHistory = () => {
	const { debouncedQuery } = useQuery();
	const { show } = useConfirmDialog();
	const { isLoading, stockHistory, archive } = useStockHistory();

	const [showArchived, setShowArchived] = useState(false);

	// Sorting state
	const [orderBy, setOrderBy] = useState<OrderBy>("date");
	const [order, setOrder] = useState<Order>("desc");

	const handleSort = (property: OrderBy) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	// 🔹 Filter by archived toggle
	const visibleStockHistory = stockHistory.filter(
		(p) => (p.archived ?? false) === showArchived
	);

	// 🔹 Apply search filter
	const searchedStockHistory = visibleStockHistory.filter((history) => {
		if (!debouncedQuery.trim()) return true;
		const q = debouncedQuery.toLowerCase();
		return (
			history.productName.toLowerCase().includes(q) ||
			String(history.stockAdjustment).includes(q) ||
			formatDate(history.date).toLowerCase().includes(q)
		);
	});

	// 🔹 Sort after filtering
	const sortedStockHistory = [...searchedStockHistory].sort((a, b) => {
		const asc = order === "asc";
		switch (orderBy) {
			case "productName":
				return asc
					? a.productName.localeCompare(b.productName)
					: b.productName.localeCompare(a.productName);
			case "stockAdjustment":
				return asc
					? a.stockAdjustment - b.stockAdjustment
					: b.stockAdjustment - a.stockAdjustment;
			case "date":
				return asc ? a.date - b.date : b.date - a.date;
			default:
				return 0;
		}
	});

	const handleArchiveToggle = (history: StockHistoryType) => {
		const actionText = history.archived
			? `Unarchiving ${history.productName}`
			: `Archiving ${history.productName}`;
		const successText = history.archived
			? `${history.productName} history unarchived successfully!`
			: `${history.productName} history archived successfully!`;
		const errorText = history.archived
			? "Failed to unarchive item."
			: "Failed to archive item.";

		const handleAction = () => {
			toast.promise(archive(history.id, !history.archived), {
				loading: actionText + "...",
				success: successText,
				error: errorText,
				id: "archived",
			});
		};

		show({
			title: history.archived ? "Unarchive Item" : "Archive Item",
			message: history.archived
				? "Are you sure you want to unarchive this item?"
				: "Are you sure you want to archive this item?",
			confirmText: history.archived ? "Unarchive" : "Archive",
			dangerText: history.archived ? "Unarchive" : "Archive",
			...(history.archived ? { onDanger: handleAction } : { onConfirm: handleAction }),
		});
	};

	return (
		<Box>
			{/* Actions (right aligned) */}
			<Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
				<Button
					variant="outlined"
					onClick={() => setShowArchived(!showArchived)}
					startIcon={<LucideFolderArchive size={18} />}
				>
					{showArchived ? "Show Active" : "Show Archived"}
				</Button>
			</Stack>

			{/* Table */}
			<TableContainer component={Paper}>
				<Typography variant="h6" sx={{ p: 2 }}>
					{showArchived ? "Archived Stock History" : "Stock History List"}
				</Typography>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === "productName"}
									direction={orderBy === "productName" ? order : "asc"}
									onClick={() => handleSort("productName")}
								>
									Product Name
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={orderBy === "stockAdjustment"}
									direction={orderBy === "stockAdjustment" ? order : "asc"}
									onClick={() => handleSort("stockAdjustment")}
								>
									Qty Change
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={orderBy === "date"}
									direction={orderBy === "date" ? order : "asc"}
									onClick={() => handleSort("date")}
								>
									Date
								</TableSortLabel>
							</TableCell>

							<TableCell align="center">Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={4} align="center">
									Loading...
								</TableCell>
							</TableRow>
						) : sortedStockHistory.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align="center">
									No Stock History
								</TableCell>
							</TableRow>
						) : (
							sortedStockHistory.map((history) => (
								<TableRow key={history.id}>
									<TableCell>{history.productName}</TableCell>
									<TableCell>{formatQty(history.stockAdjustment)}</TableCell>
									<TableCell>{formatDate(history.date)}</TableCell>
									<TableCell align="center">
										<IconButton
											onClick={() => handleArchiveToggle(history)}
											title={history.archived ? "Unarchive" : "Archive"}
										>
											{history.archived ? (
												<LucideArchiveRestore size={18} />
											) : (
												<LucideArchive size={18} />
											)}
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default StockHistory;
