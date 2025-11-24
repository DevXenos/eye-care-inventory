import * as React from "react";
import { SalesType } from "../../types/SalesType";
import StyleSheet from "../../utils/Stylesheet";
import { Button } from "@mui/material";

type Props = {
	sale: SalesType;
	onClose: () => void;
	onArchive: (sale: SalesType) => void;
};

const SalesReportView: React.FC<Props> = ({ sale, onClose, onArchive }) => {
	return (
		<div style={styles.container}>
			{/* Header */}
			<div style={styles.header}>
				<h2 style={styles.title}>Sale Report</h2>
				<button style={styles.closeBtn} onClick={onClose}>
					×
				</button>
			</div>

			{/* Sale Meta */}
			<div style={styles.meta}>
				<div><strong>Customer:</strong> {sale.customer}</div>
				<div><strong>Date:</strong> {new Date(sale.date).toLocaleString()}</div>
				<div><strong>Total Amount:</strong> ${sale.amount.toFixed(2)}</div>
				<div><strong>Items:</strong> {sale.carts.length}</div>
			</div>

			{/* Cart Items */}
			<div style={styles.cartList}>
				<h3 style={styles.cartHeader}>Cart Items</h3>
				{sale.carts.map((cart, idx) => (
					<div key={idx} style={styles.cartItem}>
						<div style={styles.cartItemName}>{cart.productName}</div>
						<div style={styles.cartItemDetails}>
							<span>Qty: {cart.quantity}</span>
							<span>Price: ${Number(cart.productPrice).toFixed(2)}</span>
						</div>
					</div>
				))}
				{sale.carts.length === 0 && (
					<p style={{ textAlign: "center", color: "#555" }}>No items in this sale</p>
				)}
			</div>

			{/* Actions */}
			<div style={styles.actions}>
				<Button variant="contained" style={styles.action}>Print</Button>
				<Button onClick={() => onArchive(sale)} variant={sale.archived ? "contained" :"outlined"} style={styles.action}>
					{sale.archived ? "Unarchive":"Archive"}
				</Button>
			</div>
		</div>
	);
};

export default SalesReportView;

// ======== STYLES ========
const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		padding: 30,
		fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
		color: "#222",
		background: "#fff",
		borderRadius: 12,
		boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
		width: "100%",
		maxWidth: 700,
	},

	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},

	title: {
		fontSize: 26,
		fontWeight: 700,
		margin: 0,
		color: "#111",
	},

	closeBtn: {
		border: "none",
		background: "transparent",
		fontSize: 28,
		lineHeight: 1,
		cursor: "pointer",
		color: "#888",
		transition: "0.2s",
	},

	meta: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: 12,
		padding: 16,
		background: "#f9f9f9",
		borderRadius: 8,
		fontSize: 15,
		color: "#555",
		lineHeight: 1.6,
	},

	cartList: {
		display: "flex",
		flexDirection: "column",
		gap: 8,
	},

	cartHeader: {
		fontSize: 18,
		fontWeight: 600,
		color: "#111",
		marginBottom: 8,
	},

	cartItem: {
		display: "flex",
		justifyContent: "space-between",
		padding: 12,
		background: "#f1f1f1",
		borderRadius: 8,
	},

	cartItemName: {
		fontWeight: 500,
		color: "#222",
	},

	cartItemDetails: {
		display: "flex",
		gap: 12,
		fontSize: 14,
		color: "#555",
	},

	actions: {
		display: "flex",
		gap: 12,
		marginTop: 20,
	},

	action: {
		flex: 1,
		fontSize: 15,
		fontWeight: 500,
	}
});
