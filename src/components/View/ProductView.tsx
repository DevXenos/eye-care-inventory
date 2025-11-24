import * as React from "react";
import { ProductType } from "../../types/ProductType";
import StyleSheet from "../../utils/Stylesheet";
// import Button from "../material/Button";
import { Button } from "@mui/material";
import useArchivedToggle from "../../hooks/utils/useArchivedToggle";

type Props = {
	product: ProductType;
	onClose: () => void;
	onArchived: () => void;
	onEdit: (item: ProductType) => void;
};

const ProductView: React.FC<Props> = ({ product, onClose, onArchived, onEdit }) => {

	const { getArchivedButtonText } = useArchivedToggle()

	return (
		<div style={styles.container}>
			{/* Image Section */}
			<div style={styles.imageWrapper}>
				<img src={product.imgSrc} alt={product.name} style={styles.image} />
			</div>

			{/* Details Section */}
			<div style={styles.details}>
				<div style={styles.header}>
					<h2 style={styles.title}>{product.name}</h2>
					<button style={styles.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				{/* Meta Information */}
				<div style={styles.meta}>
					<div><strong>Code:</strong> {product.id}</div>
					<div><strong>Category:</strong> {product.category}</div>
					<div><strong>Type:</strong> {product.type}</div>
					<div><strong>Brand:</strong> {product.brand}</div>
					<div><strong>Stock:</strong> {product.stock}</div>
					<div>
						<strong>Expiry:</strong>{" "}
						{product.expiry ? product.expiry : "No expiry"}
					</div>
					<div><strong>Cost Price:</strong> ${product.costPrice}</div>
					<div><strong>Selling Price:</strong> ${product.sellPrice}</div>
					<div>
						<strong>Status:</strong>{" "}
						{product.archived ? "Archived" : "Active"}
					</div>
				</div>

				{/* Actions */}
				<div style={styles.actions}>
					<Button onClick={() => onEdit(product)} style={styles.action}>Edit</Button>
					<Button onClick={() => onArchived()} variant={product.archived ? "contained" : "outlined"} style={styles.action}>
						{product.archived ? "Unarchived": "Archive"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProductView;

const styles = StyleSheet.create({
	container: {
		maxWidth: 700,
		display: "flex",
		gap: 20,
		alignItems: "flex-start",
		padding: 50,
		fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
		color: "#222",
	},

	imageWrapper: {
		flex: "0 0 250px",
		borderRadius: 12,
		overflow: "hidden",
		boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
		background: "#fafafa",
	},

	image: {
		width: "100%",
		height: "auto",
		display: "block",
		objectFit: "cover",
	},

	details: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		gap: 16,
	},

	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},

	title: {
		fontSize: 26,
		fontWeight: 700,
		letterSpacing: "-0.5px",
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
	}
});
