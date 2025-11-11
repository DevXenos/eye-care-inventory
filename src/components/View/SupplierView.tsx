import * as React from "react";
import { SupplierType } from "../../types/SupplierType";
import StyleSheet from "../../utils/Stylesheet";
// import Button from "../material/Button";
import { Button } from "@mui/material";

type Props = {
	supplier: SupplierType;
	onClose: () => void;
	onEdit: (supplier: SupplierType) => void;
	onArchive: (supplier: SupplierType) => void;
};

const SupplierView: React.FC<Props> = ({ supplier, onClose, onArchive, onEdit }) => {
	return (
		<div style={styles.container}>
			{/* Details Section */}
			<div style={styles.details}>
				<div style={styles.header}>
					<h2 style={styles.title}>{supplier.shopName}</h2>
					<button style={styles.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				{/* Meta Information */}
				<div style={styles.meta}>
					<div><strong>ID:</strong> {supplier.id ?? "N/A"}</div>
					<div><strong>Contact Person:</strong> {supplier.contactPerson || "N/A"}</div>
					<div><strong>Phone:</strong> {supplier.phone}</div>
					<div><strong>Email:</strong> {supplier.email}</div>
					<div><strong>Address:</strong> {supplier.address}</div>
					<div>
						<strong>Status:</strong> {supplier.archived ? "Archived" : "Active"}
					</div>
					<div>
						<strong>Created:</strong>{" "}
						{supplier.createdAt ? new Date(supplier.createdAt).toLocaleString() : "N/A"}
					</div>
					<div>
						<strong>Updated:</strong>{" "}
						{supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleString() : "N/A"}
					</div>
				</div>

				{/* Actions */}
				<div style={styles.actions}>
					<Button onClick={() => onEdit(supplier)} style={styles.action}>Edit</Button>
					<Button onClick={() => onArchive(supplier)} variant={supplier.archived ? "contained" : "outlined"} style={styles.action}>
						{supplier.archived ? "Unarchive" : "Archive"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SupplierView;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		alignItems: "flex-start",
		padding: 40,
		fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
		color: "#222",
	},

	details: {
		display: "flex",
		flexDirection: "column",
		gap: 16,
		width: "100%",
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
