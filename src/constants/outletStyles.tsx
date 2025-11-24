import StyleSheet from "../utils/Stylesheet";

const outletStyles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		padding: 12,
		gap: 12,
	},

	// Action buttons wrapper
	actionsContainer: {
		width: "100%",
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))", // responsive grid
		placeContent: "center",
		gap: 16,
	},

	// Action button base
	actionsBtn: {
		// maxWidth: 300,
		height: 48,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "0 16px",
		minWidth: 200,
		borderRadius: 12,
		fontSize: "1rem",
		fontWeight: 500,
		cursor: "pointer",
		border: "1px solid #e0e0e0",
		background: "#fff",
		transition: "all 0.2s ease",
	},

	// Variant: danger button
	actionsBtnDanger: {
		background: "#f44336",
		color: "white",
	},

	tableActions: {
		position: "sticky",
		top: "12px",
		width: "100%",
		display: "flex",
		gap: 12,
		justifyContent: "end",
	},
	tableActionBtn: {
		height: 48,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		background: "white",
		boxShadow: "0 0 3px gray",
		paddingLeft: 12*2,
		paddingRight: 12*2,
	},
});

export default outletStyles;
