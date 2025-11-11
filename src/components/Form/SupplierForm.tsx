import * as React from "react";
import { SupplierType } from "../../types/SupplierType";
import StyleSheet from "../../utils/Stylesheet";
import { Button } from "@mui/material";

type SupplierFormProps = {
	supplier?: SupplierType | null; // if passed, we're editing
	onSave: (supplier: SupplierType) => void;
	onCancel?: () => void;
};

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSave, onCancel }) => {
	const [shopName, setShopName] = React.useState(supplier?.shopName ?? "");
	const [contactPerson, setContactPerson] = React.useState(supplier?.contactPerson ?? "");
	const [phone, setPhone] = React.useState(supplier?.phone ?? "");
	const [email, setEmail] = React.useState(supplier?.email ?? "");
	const [address, setAddress] = React.useState(supplier?.address ?? "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			shopName,
			contactPerson,
			phone,
			email,
			address,
			createdAt: Date.now()
		});
	};

	return (
		<form style={styles.form} onSubmit={handleSubmit}>
			<h2 style={styles.title}>{supplier ? "Edit Supplier" : "Add Supplier"}</h2>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Shop Name *</label>
				<input
					name="company name"
					style={styles.input}
					value={shopName}
					onChange={(e) => setShopName(e.target.value)}
					required
					placeholder="Ex. ABC Trading Co."
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Contact Person</label>
				<input
					name="name"
					style={styles.input}
					value={contactPerson}
					onChange={(e) => setContactPerson(e.target.value)}
					placeholder="Ex. John Doe"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Phone</label>
				<input
					name="phonenumber"
					style={styles.input}
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="+63 912 345 6789"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Email</label>
				<input
					type="email"
					style={styles.input}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="supplier@email.com"
				/>
			</div>

			<div style={styles.fieldGroup}>
				<label style={styles.label}>Address</label>
				<textarea
					name="Address"
					style={styles.textarea}
					value={address}
					maxLength={30}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Full address of the supplier"
				/>
			</div>

			<div style={styles.actions}>
				<Button type="submit">{supplier ? "Update Supplier" : "Add Supplier"}</Button>
				{onCancel && (
					<Button type="button" variant="outlined" onClick={onCancel}>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
};

export default SupplierForm;

const styles = StyleSheet.create({
	form: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
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
	textarea: {
		padding: "10px 12px",
		borderRadius: 8,
		border: "1px solid #ddd",
		fontSize: 15,
		minHeight: 80,
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
});
