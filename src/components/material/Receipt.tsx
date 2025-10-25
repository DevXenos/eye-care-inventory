// components/POS/Receipt.tsx
import * as React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AnimationButton from "../material/AnimationButton";
import formatMoney from "../../utils/formatMoney";

// ----------------------
// Receipt Component
// ----------------------
type ReceiptProps = {
	customer: string;
	carts: {
		productId: string | number;
		productName: string;
		productPrice: number;
		quantity: number;
	}[];
	total: number;
	date: number;
};

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
	({ customer, carts, total, date }, ref) => {
		return (
			<div ref={ref} style={{ padding: 20, fontFamily: "monospace" }}>
				<h2 style={{ textAlign: "center" }}>🧾 Sales Receipt</h2>
				<p>Date: {new Date(date).toLocaleString()}</p>
				<p>Customer: {customer}</p>
				<hr />

				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th align="left">Item</th>
							<th align="right">Qty</th>
							<th align="right">Price</th>
							<th align="right">Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{carts.map((cart, i) => (
							<tr key={i}>
								<td>{cart.productName}</td>
								<td align="right">{cart.quantity}</td>
								<td align="right">{formatMoney(cart.productPrice, "₱")}</td>
								<td align="right">
									{formatMoney(cart.quantity * cart.productPrice, "₱")}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<hr />
				<h3 style={{ textAlign: "right" }}>
					Total: {formatMoney(total, "₱")}
				</h3>
				<p style={{ textAlign: "center" }}>Thank you for your purchase!</p>
			</div>
		);
	}
);

// ----------------------
// ReceiptWrapper Component
// ----------------------
type WrapperProps = ReceiptProps & {
	onClose: () => void;
};

const ReceiptWrapper: React.FC<WrapperProps> = ({ customer, carts, total, date, onClose }) => {
	const receiptRef = useRef<HTMLDivElement | null>(null);

	const handlePrint = useReactToPrint({
		contentRef: receiptRef,
		documentTitle: `Receipt_${new Date(date).toISOString()}`,
	});

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 9999,
			}}
		>
			<div
				style={{
					background: "white",
					padding: 24,
					borderRadius: 12,
					maxWidth: 400,
					width: "90%",
					display: "flex",
					flexDirection: "column",
					gap: 16,
				}}
			>
				<Receipt ref={receiptRef} customer={customer} carts={carts} total={total} date={date} />

				<div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
					<AnimationButton onClick={handlePrint} style={{ flex: 1 }}>
						Print
					</AnimationButton>
					<AnimationButton onClick={onClose} style={{ flex: 1 }}>
						Close
					</AnimationButton>
				</div>
			</div>
		</div>
	);
};

// ----------------------
// Exports
// ----------------------
export { Receipt, ReceiptWrapper };
