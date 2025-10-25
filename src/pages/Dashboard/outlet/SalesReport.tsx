import { LucideEye, LucideFolderArchive } from "lucide-react";
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
	TextField,
	Typography,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import SalesReportView from "../../../components/View/SalesReportView";
import useSalesReport from "../../../hooks/useSalesReport";
import useArchivedToggle from "../../../hooks/utils/useArchivedToggle";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import ArchiveButtonIcon from "../../../components/material/ArchiveButtonIcon";
import { toast } from "sonner";
import { useQuery } from "../../../context/QueryProvider";
import formatDate from "../../../utils/formatDate";
import formatMoney from "../../../utils/formatMoney";
import { SalesType } from "../../../types/SalesType";
import React from "react";
import { PrintSalesReportWrapper } from "../../../components/material/PrintSalesReport";

type Order = "asc" | "desc";
type SortKey = "date" | "customer" | "amount";

const SalesReport: React.FC = () => {
	const { isLoading, salesReport, setArchived } = useSalesReport();
	const { showArchived, toggleArchived, getArchivedButtonText } = useArchivedToggle();
	const { show } = useConfirmDialog();
	const { query } = useQuery();

	const [selectedSales, setSelectedSales] = React.useState<SalesType | null>(null);

	const [orderBy, setOrderBy] = React.useState<SortKey>("date");
	const [order, setOrder] = React.useState<Order>("asc"); // Default: oldest first

	const [showPrint, setShowPrint] = React.useState(false);


	// Set default start/end dates based on data
	const [startDate, setStartDate] = React.useState(() => {
		if (salesReport.length === 0) return new Date().toISOString().split("T")[0];
		const oldest = new Date(Math.min(...salesReport.map((s) => s.date)));
		return oldest.toISOString().split("T")[0];
	});

	const [endDate, setEndDate] = React.useState(() => {
		if (salesReport.length === 0) return new Date().toISOString().split("T")[0];
		const latest = new Date(Math.max(...salesReport.map((s) => s.date)));
		return latest.toISOString().split("T")[0];
	});

	const handleRequestSort = (property: SortKey) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleArchive = (sale: SalesType) => {
		const handleAction = () => {
			toast.promise(setArchived(sale.id, !sale.archived), {
				loading: sale.archived ? "Unarchiving sale..." : "Archiving sale...",
				success: sale.archived
					? `Sale from "${sale.customer}" unarchived successfully!`
					: `Sale from "${sale.customer}" archived successfully!`,
				error: sale.archived ? "Failed to unarchive sale." : "Failed to archive sale.",
				finally: () => setSelectedSales(null),
			});
		};

		show({
			title: sale.archived ? "Unarchive Sale" : "Archive Sale",
			message: sale.archived
				? `Are you sure you want to unarchive this sale from "${sale.customer}"?`
				: `Are you sure you want to archive this sale from "${sale.customer}"?`,
			onConfirm: sale.archived ? handleAction : undefined,
			onDanger: !sale.archived ? handleAction : undefined,
		});
	};

	// Filter + sort
	const filteredSales = salesReport
		.filter((s) => (s.archived ?? false) === showArchived)
		.filter((s) => {
			const saleDateStr = new Date(s.date).toISOString().split("T")[0];
			return saleDateStr >= startDate && saleDateStr <= endDate;
		})
		.filter((s) => {
			if (!query) return true;
			const lower = query.toLowerCase();
			return (
				s.customer.toLowerCase().includes(lower) ||
				formatDate(s.date).toLowerCase().includes(lower) ||
				String(s.amount).includes(query)
			);
		})
		.slice()
		.sort((a, b) => {
			let cmp = 0;
			switch (orderBy) {
				case "date":
					cmp = a.date - b.date;
					break;
				case "customer":
					cmp = a.customer.localeCompare(b.customer);
					break;
				case "amount":
					cmp = a.amount - b.amount;
					break;
			}
			return order === "asc" ? cmp : -cmp;
		});

	return (
		<Box>
			<Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 2 }}>
				<Button
					variant="outlined"
					startIcon={<LucideFolderArchive />}
					onClick={toggleArchived}
				>
					{getArchivedButtonText()}
				</Button>
				<Button
					variant="outlined"
					onClick={() => setShowPrint(true)}
				>
					Print
				</Button>
			</Stack>

			<Paper>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Typography variant="h6" p={2}>
						Sales Report
					</Typography>

					<Stack direction="row" spacing={2} p={2}>
						<TextField
							label="Start"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="End"
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
					</Stack>
				</Box>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<TableSortLabel
										active={orderBy === "date"}
										direction={orderBy === "date" ? order : "asc"}
										onClick={() => handleRequestSort("date")}
									>
										Date
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === "customer"}
										direction={orderBy === "customer" ? order : "asc"}
										onClick={() => handleRequestSort("customer")}
									>
										Customer
									</TableSortLabel>
								</TableCell>
								<TableCell>
									<TableSortLabel
										active={orderBy === "amount"}
										direction={orderBy === "amount" ? order : "asc"}
										onClick={() => handleRequestSort("amount")}
									>
										Amount
									</TableSortLabel>
								</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{filteredSales.length === 0 && !isLoading && (
								<TableRow>
									<TableCell colSpan={4} align="center">
										No Sales Report
									</TableCell>
								</TableRow>
							)}

							{filteredSales.map((sale) => (
								<TableRow key={sale.id}>
									<TableCell>{formatDate(sale.date)}</TableCell>
									<TableCell>{sale.customer}</TableCell>
									<TableCell>{formatMoney(sale.amount, "₱")}</TableCell>
									<TableCell align="right">
										<IconButton onClick={() => setSelectedSales(sale)}>
											<LucideEye />
										</IconButton>
										<IconButton onClick={() => handleArchive(sale)}>
											<ArchiveButtonIcon archived={sale.archived} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

			<AnimatePresence>
				{selectedSales && (
					<MaterialDialog closeOnClickOutside onClose={() => setSelectedSales(null)}>
						<SalesReportView
							onArchive={handleArchive}
							sale={selectedSales}
							onClose={() => setSelectedSales(null)}
						/>
					</MaterialDialog>
				)}
				
				{showPrint && (
					<PrintSalesReportWrapper
						filteredSales={filteredSales}
						startDate={startDate}
						endDate={endDate}
						onClose={() => setShowPrint(false)}
					/>
				)}
			</AnimatePresence>

		</Box>
	);
};

export default SalesReport;
