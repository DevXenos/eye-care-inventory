import { LucideArchive, LucideEye, LucideFilter, LucideFolderArchive } from "lucide-react";
import Table from "../../../components/UI/Table/Table";
import { useDialogContext } from "@jtech-works/dialog";
import AnimationButton from "../../../components/material/AnimationButton";
import outletStyles from "../../../constants/outletStyles";
import useSalesReport from "../../../hooks/useSalesReport";
import formatDate from "../../../utils/formatDate";
import formatMoney from "../../../utils/formatMoney";
import { useState } from "react";
import { SalesType } from "../../../types/SalesType";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import SalesReportView from "../../../components/View/SalesReportView";
import useArchivedToggle from "../../../hooks/utils/useArchivedToggle";
import ArchiveButtonIcon from "../../../components/material/ArchiveButtonIcon";
import { useConfirmDialog } from "../../../context/ConfirmDialogProvider";
import { toast } from "sonner";

const SalesReport = () => {
	const { isLoading, salesReport, setArchived } = useSalesReport();
	const { showArchived, toggleArchived, getArchivedButtonText } = useArchivedToggle()
	const { show } = useConfirmDialog()

	const [selectedSales, setSelectedSales] = useState<SalesType | null>(null);

	const handleArchive = (sale: SalesType) => {
		const handleAction = () => {
			toast.promise(
				setArchived(sale.id, !sale.archived),
				{
					loading: sale.archived ? "Unarchiving sale..." : "Archiving sale...",
					success: sale.archived
						? `Sale from "${sale.customer}" unarchived successfully!`
						: `Sale from "${sale.customer}" archived successfully!`,
					error: sale.archived
						? "Failed to unarchive sale."
						: "Failed to archive sale.",
					finally: () => {
						setSelectedSales(null);
					}
				}
			);
		};

		show({
			title: sale.archived ? "Unarchive Sale" : "Archive Sale",
			message: sale.archived
				? `Are you sure you want to unarchive this sale from "${sale.customer}"?`
				: `Are you sure you want to archive this sale from "${sale.customer}"?`,
			onConfirm: sale.archived ? handleAction : undefined,
			onDanger: !sale.archived ? handleAction : undefined,
		});
	}

	const shownSalesReport = salesReport
		.sort((a, b) => b.date - a.date)
		.filter((p) => (p.archived ?? false) === showArchived);

	return (
		<div style={outletStyles.container}>
			<div style={outletStyles.tableActions}>
				<AnimationButton onClick={toggleArchived}>
					<LucideFolderArchive />
					{getArchivedButtonText()}
				</AnimationButton>

				<AnimationButton>
					<LucideFilter />
				</AnimationButton>
			</div>

			<div className='table-container'>
				<h2 className="title">
					Sales Report
				</h2>
				<Table isLoading={isLoading} emptyMessage="No Sales Report" headers={["Date", "Customer", "Amount", '']}>
					{shownSalesReport
						.map((sale, index) => (
						<tr key={index}>
							<td>{formatDate(sale.date)}</td>
							<td>{sale.customer}</td>
							<td>{formatMoney(sale.amount, '₱')}</td>
							<td>
								<div className="actions">
									<button className='action' title="View" onClick={() => {
										setSelectedSales(sale);
									}}>
										<LucideEye />
									</button>
										<button
											title={sale.archived ? "Unarchive" : "Archive"}
											className="action"
											onClick={() => {
												handleArchive(sale);
											}}
										>
											<ArchiveButtonIcon archived={sale.archived} />
										</button>
								</div>
							</td>
						</tr>
					))}
				</Table>
			</div>

			<AnimatePresence>
				{selectedSales && (
					<MaterialDialog closeOnClickOutside onClose={() => setSelectedSales(null)}>
						<SalesReportView
							onArchive={(sale) => handleArchive(sale)}
							sale={selectedSales}
							onClose={() => setSelectedSales(null)}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SalesReport;
