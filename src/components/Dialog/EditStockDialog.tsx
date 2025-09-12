import { LucideXCircle } from "lucide-react";
import * as React from "react";

interface EditStockProps {
	currentStock: number;
	onSave: (newStock: number) => void;
	onClose: () => void;
}

const EditStockDialog: React.FC<EditStockProps> = ({ currentStock, onSave, onClose }) => {
	const [stock, setStock] = React.useState<number|string>('');

	return (
		<div className="dialog edit-stock-dialog">
			<header>
				<h2>Edit Stock</h2>
				<LucideXCircle onClick={onClose} />
			</header>

			<label>
				Add Stock
				<input
					type="number"
					value={stock}
					onChange={(e) => {
						// Parse then normalize to remove leading zeros
						const rawValue = e.target.value;
						const parsed = rawValue === "" ? 0 : parseInt(rawValue, 10);
						setStock(parsed);
					}}
				/>
			</label>

			<button
				onClick={() => {
					onSave(stock as number);
					onClose();
				}}
			>
				Save
			</button>
		</div>
	);
};

export default EditStockDialog;
