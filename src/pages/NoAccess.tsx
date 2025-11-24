import * as React from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Typography,
	Button,
	Paper,
	useTheme,
	Fade,
	Stack,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";

const NoAccess: React.FC = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: `
          radial-gradient(circle at top left, ${theme.palette.primary.light}22, transparent 40%),
          radial-gradient(circle at bottom right, ${theme.palette.secondary.main}22, transparent 40%),
          ${theme.palette.mode === "dark" ? "#0b0b10" : "#f5f7fb"}
        `,
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Decorative light effects */}
			<Box
				sx={{
					position: "absolute",
					top: "10%",
					left: "10%",
					width: 180,
					height: 180,
					background: theme.palette.primary.main,
					borderRadius: "50%",
					filter: "blur(120px)",
					opacity: 0.4,
				}}
			/>
			<Box
				sx={{
					position: "absolute",
					bottom: "15%",
					right: "15%",
					width: 220,
					height: 220,
					background: theme.palette.secondary.main,
					borderRadius: "50%",
					filter: "blur(140px)",
					opacity: 0.35,
				}}
			/>

			<Fade in timeout={700}>
				<Paper
					elevation={8}
					sx={{
						p: 6,
						borderRadius: 5,
						maxWidth: 480,
						width: "90%",
						textAlign: "center",
						backdropFilter: "blur(18px)",
						background:
							theme.palette.mode === "dark"
								? "rgba(30, 30, 40, 0.75)"
								: "rgba(255, 255, 255, 0.7)",
						border: "1px solid rgba(255, 255, 255, 0.15)",
						boxShadow: `
              0 8px 32px rgba(0,0,0,0.25),
              inset 0 0 0.5px rgba(255,255,255,0.3)
            `,
						zIndex: 2,
					}}
				>
					<Stack spacing={3} alignItems="center">
						<Box
							sx={{
								background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.primary.main})`,
								width: 90,
								height: 90,
								borderRadius: "50%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								animation: "float 3s ease-in-out infinite",
								"@keyframes float": {
									"0%, 100%": { transform: "translateY(0)" },
									"50%": { transform: "translateY(-10px)" },
								},
								boxShadow: `0 0 30px ${theme.palette.error.main}55`,
							}}
						>
							<BlockIcon sx={{ fontSize: 48, color: "#fff" }} />
						</Box>

						<Typography
							variant="h4"
							fontWeight={800}
							color="text.primary"
							sx={{
								letterSpacing: "0.5px",
								textShadow: `0 2px 6px rgba(0,0,0,0.3)`,
							}}
						>
							Access Denied
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ maxWidth: 320 }}
						>
							You don’t have permission to access this page. Please log in to
							continue.
						</Typography>

						<Button
							variant="contained"
							component={Link}
							to="/"
							sx={{
								textTransform: "none",
								fontWeight: 700,
								borderRadius: 3,
								px: 4,
								py: 1.4,
								fontSize: 16,
								background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								boxShadow: `0 4px 20px ${theme.palette.primary.main}66`,
								transition: "all 0.3s ease",
								"&:hover": {
									transform: "translateY(-3px)",
									boxShadow: `0 6px 25px ${theme.palette.secondary.main}99`,
								},
							}}
						>
							Return to Login
						</Button>
					</Stack>
				</Paper>
			</Fade>
		</Box>
	);
};

export default NoAccess;
