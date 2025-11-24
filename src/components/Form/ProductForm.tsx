import * as React from "react";
import { Button } from "@mui/material";
import { ProductType } from "../../types/ProductType";
import StyleSheet from "../../utils/Stylesheet";
// import Button from "../material/Button";

type ProductFormProps = {
	product?: ProductType | null; // edit mode if passed
	onSave: (product: Omit<ProductType, "id"|"created">) => Promise<void>;
	onCancel?: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
	const [formData, setFormData] = React.useState<Omit<ProductType, "id"|"created">>({
		name: product?.name || "",
		category: product?.category || "",
		type: product?.type || "",
		brand: product?.brand || "",
		stock: product?.stock || 0,
		expiry: product?.expiry || null,
		costPrice: product?.costPrice || 0,
		sellPrice: product?.sellPrice || 0,
		imgSrc: product?.imgSrc || "",
		archived: product?.archived || false,
	});

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const checked = (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

		setFormData((prev) => ({
			...prev,
			[name]: (e.target as HTMLInputElement).type === "checkbox" ? checked : value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setFormData((prev) => ({
					...prev,
					imgSrc: event.target?.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	const handlePreviewClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<form style={styles.form} onSubmit={handleSubmit}>
			<h2 style={styles.title}>{product ? "Edit Product" : "Add Product"}</h2>

			{/* Image preview on top (clickable) */}
			<div style={styles.imagePreviewWrapper} onClick={handlePreviewClick}>
				{formData.imgSrc ? (
					<img src={formData.imgSrc} alt="Product Preview" style={styles.imagePreview} />
				) : (
					<span style={styles.placeholderText}>Click to select image</span>
				)}
			</div>

			{/* Hidden file input */}
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				ref={fileInputRef}
				style={{ display: "none" }}
			/>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Name *</label>
				<input
					name="name"
					style={styles.input}
					value={formData.name}
					onChange={handleChange}
					required
					placeholder="Product Name"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Category</label>
				<input
					name="category"
					style={styles.input}
					value={formData.category}
					onChange={handleChange}
					placeholder="Category"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Type</label>
				<input
					name="type"
					style={styles.input}
					value={formData.type}
					onChange={handleChange}
					placeholder="Type"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Brand</label>
				<input
					name="brand"
					style={styles.input}
					value={formData.brand}
					onChange={handleChange}
					placeholder="Brand"
				/>
			</div>

			{!product && (
				<div style={styles.fieldGroup}>
					<label style={styles.label}>Stock</label>
					<input
						type="number"
						name="stock"
						style={styles.input}
						value={formData.stock}
						onChange={handleChange}
						placeholder="0"
					/>
				</div>
			)}

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Expiry</label>
				<input
					type="date"
					name="expiry"
					style={styles.input}
					value={formData.expiry || ""}
					onChange={handleChange}
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Cost Price</label>
				<input
					type="number"
					name="costPrice"
					style={styles.input}
					value={formData.costPrice}
					onChange={handleChange}
					step="0.01"
					placeholder="0.00"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Sell Price</label>
				<input
					type="number"
					name="sellPrice"
					style={styles.input}
					value={formData.sellPrice}
					onChange={handleChange}
					step="0.01"
					placeholder="0.00"
				/>
			</div>

			{product && (
				<label style={styles.checkbox}>
					<input
						type="checkbox"
						name="archived"
						checked={formData.archived}
						onChange={handleChange}
					/>
					Archived
				</label>
			)}

			<div style={styles.actions}>
				<Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
				{onCancel && (
					<Button type="button" variant="outlined" onClick={onCancel}>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
};

export default ProductForm;

const styles = StyleSheet.create({
	form: {
		display: "flex",
		flexDirection: "column",
		gap: 16,
		padding: 32,
		background: "#fff",
		borderRadius: 16,
		boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
	},
	title: {
		margin: 0,
		fontSize: 22,
		fontWeight: 700,
		color: "#111",
		textAlign: "center",
	},
	fieldGroup: {
		display: "flex",
		flexDirection: "column",
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: 500,
		color: "#333",
	},
	input: {
		padding: "10px 12px",
		borderRadius: 8,
		border: "1px solid #ddd",
		fontSize: 15,
		transition: "all 0.2s",
	},
	checkbox: {
		display: "flex",
		alignItems: "center",
		gap: 8,
		fontSize: 14,
		color: "#666",
	},
	actions: {
		display: "flex",
		gap: 12,
		marginTop: 16,
	},
	imagePreviewWrapper: {
		marginLeft: "auto",
		marginRight: "auto",
		width: "30%",
		aspectRatio: 1 / 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		borderWidth: 3,
		borderColor: "black",
		borderStyle: "dashed",
		padding: 5,
		cursor: "pointer",
	},
	imagePreview: {
		maxWidth: "100%",
		maxHeight: "100%",
		objectFit: "contain",
		borderRadius: 12,
	},
	placeholderText: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
	},
});
