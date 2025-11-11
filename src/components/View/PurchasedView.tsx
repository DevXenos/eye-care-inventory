import * as React from "react";
import { PurchaseType } from "../../types/PurchaseType";
import StyleSheet from "../../utils/Stylesheet";
import { Button } from "@mui/material";

type Props = {
	purchase: PurchaseType;
	onClose: () => void;
	onArchive?: (purchase: PurchaseType) => void;
	onEdit?: (purchase: PurchaseType) => void;
};

const PurchaseView: React.FC<Props> = ({ purchase, onClose, onEdit, onArchive }) => {
	return (
		<div style={styles.container}>
			{/* Header */}
			<div style={styles.header}>
				<h2 style={styles.title}>Purchase Details</h2>
				<button style={styles.closeBtn} onClick={onClose}>
					×
				</button>
			</div>

			{/* Purchase Meta */}
			<div style={styles.meta}>
				<div><strong>ID:</strong> {purchase.id || "N/A"}</div>
				<div><strong>Supplier:</strong> {purchase.supplier}</div>
				<div><strong>Status:</strong> {purchase.status}</div>
				<div><strong>Date:</strong> {new Date(purchase.date).toLocaleString()}</div>
				<div><strong>Total Amount:</strong> ${purchase.amount.toFixed(2)}</div>
			</div>

			{/* Products List */}
			<div style={styles.productsSection}>
				<h3 style={styles.sectionTitle}>Products</h3>
				<div style={styles.productsGrid}>
					{purchase.products.map((p, i) => (
						<div key={i} style={styles.productRow}>
							<div style={styles.productName}>{p.name}</div>
							<div style={styles.productInfo}>
								Qty: {p.quantity} | Price: ${p.price.toFixed(2)} | Subtotal: ${(p.quantity * p.price).toFixed(2)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Actions */}
			<div style={styles.actions}>
				<Button onClick={() => onEdit?.(purchase)} style={styles.action}>Edit</Button>
				<Button onClick={() => onArchive?.(purchase)} variant={purchase.archived ? "contained" : "outlined"} style={styles.action}>
					{purchase.archived ? "Unarchive" :"Archive"}
				</Button>
			</div>
		</div>
	);
};

export default PurchaseView;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		padding: 40,
		fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
		color: "#222",
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

	productsSection: {
		display: "flex",
		flexDirection: "column",
		gap: 12,
	},

	sectionTitle: {
		fontSize: 18,
		fontWeight: 600,
		color: "#007bff",
		margin: 0,
	},

	productsGrid: {
		display: "flex",
		flexDirection: "column",
		gap: 8,
	},

	productRow: {
		display: "flex",
		justifyContent: "space-between",
		padding: "8px 12px",
		background: "#f1f1f1",
		borderRadius: 6,
	},

	productName: {
		fontWeight: 500,
	},

	productInfo: {
		color: "#555",
		fontSize: 14,
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
	},
});
