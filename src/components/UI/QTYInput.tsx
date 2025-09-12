import { LucideMinusSquare, LucidePlusSquare } from "lucide-react";
import * as React from "react";

type QTYInputProps = {
	value: number;
	onChange: (value: number) => void;
};

const QTYInput: React.FC<QTYInputProps> = ({value, onChange}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value, 10);
		if (!isNaN(newValue) && newValue >= 1) {
			onChange(newValue);
		}
	};
	return (
		<div className="input-qty">
			<LucideMinusSquare onClick={() => onChange(value > 1 ? value - 1 : 1)} />
			<input type="number" min={0} value={value} onChange={handleChange} />
			<LucidePlusSquare onClick={() => onChange(value + 1)} />
		</div>
	);
}

export default QTYInput;