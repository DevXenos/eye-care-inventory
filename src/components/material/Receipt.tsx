// components/POS/Receipt.tsx
import * as React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
	Box,
	Button,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Divider,
	Paper,
	Dialog,
	DialogContent,
	DialogActions,
} from "@mui/material";
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
			<Box ref={ref} p={3} fontFamily="monospace">
				<Typography variant="h5" align="center" gutterBottom>
					🧾 Sales Receipt
				</Typography>

				<Typography variant="body2">Date: {new Date(date).toLocaleString()}</Typography>
				<Typography variant="body2" gutterBottom>
					Customer: {customer}
				</Typography>

				<Divider sx={{ my: 2 }} />

				<Paper variant="outlined">
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Item</TableCell>
								<TableCell align="right">Qty</TableCell>
								<TableCell align="right">Price</TableCell>
								<TableCell align="right">Subtotal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{carts.map((cart, i) => (
								<TableRow key={i}>
									<TableCell>{cart.productName}</TableCell>
									<TableCell align="right">{cart.quantity}</TableCell>
									<TableCell align="right">
										{formatMoney(cart.productPrice, "₱")}
									</TableCell>
									<TableCell align="right">
										{formatMoney(cart.quantity * cart.productPrice, "₱")}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>

				<Divider sx={{ my: 2 }} />

				<Typography variant="h6" align="right">
					Total: {formatMoney(total, "₱")}
				</Typography>

				<Typography variant="body2" align="center" sx={{ mt: 3 }}>
					Thank you for your purchase!
				</Typography>
			</Box>
		);
	}
);

// ----------------------
// ReceiptWrapper Component
// ----------------------
type WrapperProps = ReceiptProps & {
	onClose: () => void;
};

const ReceiptWrapper: React.FC<WrapperProps> = ({
	customer,
	carts,
	total,
	date,
	onClose,
}) => {
	const receiptRef = useRef<HTMLDivElement | null>(null);

	const handlePrint = useReactToPrint({
		contentRef: receiptRef,
		documentTitle: `Receipt_${new Date(date).toISOString()}`,
	});

	return (
		<Dialog
			open
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					p: 1,
				},
			}}
		>
			<DialogContent dividers>
				<Receipt
					ref={receiptRef}
					customer={customer}
					carts={carts}
					total={total}
					date={date}
				/>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button
					onClick={handlePrint}
					variant="contained"
					color="primary"
					fullWidth
				>
					Print
				</Button>
				<Button
					onClick={onClose}
					variant="outlined"
					color="secondary"
					fullWidth
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

// ----------------------
// Exports
// ----------------------
export { Receipt, ReceiptWrapper };
