import {
	LucideCamera,
	LucideShieldCheck,
	LucideTrash2,
	LucideUserCog,
} from "lucide-react";
import * as React from "react";
import StyleSheet from "../../../utils/Stylesheet";
import outletStyles from "../../../constants/outletStyles";
import combined from "../../../utils/combine";
import useCurrentUser from "../../../hooks/useCurrentUser";

const Settings: React.FC = () => {

	const [threshold, setThreshold] = React.useState<number>(10);

	const { isLoading: isCurrentUserLoading, currentUser } = useCurrentUser();

	if (isCurrentUserLoading) {
		return (
			<div style={outletStyles.container}>
				<h1>Loading...</h1>
			</div>
		)
	}

	return (
		<div style={outletStyles.container}>
			{/* Profile Header */}
			<div style={styles.header}>
				<div style={styles.avatarWrapper}>
					<img src="/placeholder/user.png" alt="User Avatar" style={styles.avatar} />
					<div style={styles.cameraIcon}>
						<LucideCamera size={18} />
					</div>
				</div>

				<div style={styles.userInfo}>
					<h2 style={styles.name}>
						{currentUser?.displayName || 'Name'}
					</h2>
					<h3 style={styles.username}>
						{currentUser?.email || '@justinegonzales'}
					</h3>
					<p style={styles.status}>Member since March 2024</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Quick Actions</h4>
				<div style={outletStyles.actionsContainer}>
					<button style={outletStyles.actionsBtn}>
						<LucideUserCog />
						<span>Edit Profile</span>
					</button>

					<button style={outletStyles.actionsBtn}>
						<LucideShieldCheck />
						<span>Change Password</span>
					</button>

					<button style={combined(outletStyles.actionsBtn, outletStyles.actionsBtnDanger)}>
						<LucideTrash2 />
						<span>Delete Account</span>
					</button>
				</div>
			</div>

			{/* Preferences */}
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Preferences</h4>
				<div style={styles.formGroup}>
					<label style={styles.label} htmlFor="stockAlert">
						Alert me when stock falls to or below:
					</label>
					<input
						id="stockAlert"
						type="number"
						placeholder="Enter stock threshold"
						style={styles.input}
						value={threshold}
						onChange={(e) => setThreshold(Number(e.target.value))}
					/>
					<small style={styles.helperText}>
						You’ll receive a notification when stock reaches this level.
					</small>
				</div>
			</div>

			<button style={styles.logoutBtn}>Log out</button>
		</div>
	);
};

export default Settings;

const styles = StyleSheet.create({
	// Header
	header: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "1rem",
	},

	avatarWrapper: {
		position: "relative",
		width: "120px",
		height: "120px",
	},

	avatar: {
		width: "100%",
		height: "100%",
		borderRadius: "50%",
		objectFit: "cover",
	},

	cameraIcon: {
		position: "absolute",
		bottom: 0,
		right: 0,
		background: "#fff",
		borderRadius: "50%",
		padding: "6px",
		boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
		cursor: "pointer",
	},

	userInfo: {
		textAlign: "center",
	},

	name: {
		margin: 0,
		fontSize: "1.6rem",
		fontWeight: 600,
	},

	username: {
		margin: 0,
		fontSize: "1rem",
		opacity: 0.7,
	},

	status: {
		fontSize: "0.9rem",
		opacity: 0.6,
		margin: "0.25rem 0 0",
	},

	// Sections
	section: {
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
	},

	sectionTitle: {
		fontSize: "1.2rem",
		fontWeight: 600,
		margin: 0,
	},

	// Inputs
	formGroup: {
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
	},

	label: {
		fontWeight: 500,
		fontSize: "1rem",
	},

	input: {
		padding: "0.75rem 1rem",
		borderRadius: "10px",
		border: "1px solid #ccc",
		fontSize: "1rem",
	},

	helperText: {
		fontSize: "0.85rem",
		opacity: 0.6,
	},

	logoutBtn: {
		...outletStyles.actionsBtn,
		...outletStyles.actionsBtnDanger,
		width: "100%",
		maxWidth: 300,
		marginLeft: "auto",
		marginRight: "auto",
	}
});
