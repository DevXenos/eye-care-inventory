import Table from '../../../components/UI/Table/Table';
import formatQty from '../../../utils/formatQty';
import {
    LucideArchive,
    LucideArchiveRestore,
    LucideEye,
    LucideFilter,
    LucideFolderArchive,
    LucidePackage,
    LucidePen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDialogContext } from '@jtech-works/dialog';

import formatDate from '../../../utils/formatDate';
import { StockHistoryType } from '../../../types/StockHistoryType';
import useStockHistory from '../../../hooks/useStockHistory';
import outletStyles from '../../../constants/outletStyles';
import AnimationButton from '../../../components/material/AnimationButton';
import { useState } from 'react';
import { useConfirmDialog } from '../../../context/ConfirmDialogProvider';
import { toast } from 'sonner';

const Inventory = () => {
	const { show, hide } = useConfirmDialog();
	const { isLoading, stockHistory, archive } = useStockHistory();

	const [showArchived, setShowArchived] = useState(false);

	const filteredStockHistory = stockHistory
		.sort((a, b) => b.date - a.date)
		.filter((p) => (p.archived ?? false) === showArchived);

	return (
		<div style={outletStyles.container}>
			<div style={outletStyles.tableActions}>
				<AnimationButton onClick={() => setShowArchived(!showArchived)}>
					<LucideFolderArchive />
					{showArchived ? "Show Active" : "Show Archived"} {/* Dynamic text */}
				</AnimationButton>

				<button className="action">
					<LucideFilter/>
				</button>
			</div>

			<div className="table-container">
				<h2 className="title">Stock History List</h2>
				<Table
					emptyMessage='No Stock History'
					isLoading={isLoading}
					headers={[
						"Product Name",
						"Qty Change",
						"Date",
						"",
					]}
				>
					{filteredStockHistory.map((history: StockHistoryType, index) => (
						<tr key={index}>
							<td>{`${history.productName}`}</td>
							<td>{formatQty(history.stockAdjustment)}</td>
							<td>{formatDate(history.date)}</td>
							<td>
								<div className="actions">
									<button
										title={history.archived ? "Unarchive" : "Archive"} // dynamic tooltip
										className="action"
										onClick={() => {

											const handleAction = () => {
												const actionText = history.archived ? `Unarchiving ${history.productName}` : `Archiving ${history.productName}`;
												const successText = history.archived ? `${history.productName} history unarchived successfully!` : `${history.productName} history archived successfully!`;
												const errorText = history.archived ? "Failed to unarchive item." : "Failed to archive item.";

												toast.promise(
													archive(history.id, !history.archived),
													{
														loading: actionText + "...",
														success: successText,
														error: errorText,
														id: "archived",
													}
												);
											};

											show({
												title: history.archived ? "Unarchive Item" : "Archive Item",
												dangerText: "Archive",
												message: history.archived
													? "Are you sure you want to unarchive this item?"
													: "Are you sure you want to archive this item?",
												...(history.archived ? {
													onConfirm: handleAction,
												} : {
													onDanger: handleAction
												})
											});
										}}
									>
										{history.archived ? (
											<LucideArchiveRestore />
										) : (
											<LucideArchive />
										)}
									</button>
								</div>
							</td>
						</tr>
					))}
				</Table>
			</div>
		</div>
	);
};

export default Inventory;