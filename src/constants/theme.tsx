import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#27548B",
			contrastText: "#ffffff",
		},
		background: {
			default: "hsl(72, 10.20408163265302%, 93%)",
			paper: "#ffffff",
		},
		text: {
			primary: "#333333",
			secondary: "#555555",
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			'defaultProps': {
				variant: "contained"
			},
			styleOverrides: {
				root: {
					height: 48,
					textTransform: "none",
					borderRadius: 8,
					fontWeight: 600,
				},
			},
			variants: [
			]
		},
	},
});
