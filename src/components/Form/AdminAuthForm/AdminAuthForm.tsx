import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
	Paper,
	Typography,
	TextField,
	Button,
	Box,
	InputAdornment,
	Divider,
} from "@mui/material";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import Colors from "../../../constants/Colors";
import background from "./../../../assets/images/background.png";
import EmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";

const AdminAuthForm: React.FC = () => {
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = (formData.get("email") as string) || "alpha@gmail.com";
		const password = (formData.get("password") as string) || "Password";

		signInWithEmailAndPassword(auth, email, password)
			.catch(() => createUserWithEmailAndPassword(auth, email, password))
			.finally(() => navigate("/dashboard"));
	};

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				backgroundImage: `
          linear-gradient(135deg, rgba(0,0,20,0.85), rgba(0,0,0,0.7)),
          url(${background})
        `,
				backgroundSize: "cover",
				backgroundPosition: "center",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Decorative glow blobs */}
			<Box
				sx={{
					position: "absolute",
					width: 280,
					height: 280,
					borderRadius: "50%",
					background: `${Colors.primary}44`,
					top: "10%",
					left: "10%",
					filter: "blur(180px)",
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					position: "absolute",
					width: 350,
					height: 350,
					borderRadius: "50%",
					background: `#00f0ff33`,
					bottom: "10%",
					right: "10%",
					filter: "blur(180px)",
					zIndex: 0,
				}}
			/>

			<Paper
				component="form"
				onSubmit={handleSubmit}
				elevation={12}
				sx={{
					position: "relative",
					zIndex: 1,
					width: "100%",
					maxWidth: 460,
					display: "flex",
					flexDirection: "column",
					gap: 3,
					p: 5,
					borderRadius: 5,
					background: "rgba(255, 255, 255, 0.08)",
					backdropFilter: "blur(25px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					boxShadow: `
            0 0 50px rgba(0,0,0,0.5),
            inset 0 0 0.5px rgba(255,255,255,0.2)
          `,
					color: "#fff",
					animation: "fadeInUp 0.8s ease-out",
					"@keyframes fadeInUp": {
						from: { opacity: 0, transform: "translateY(40px)" },
						to: { opacity: 1, transform: "translateY(0)" },
					},
				}}
			>
				<Typography
					variant="h4"
					align="center"
					fontWeight={700}
					sx={{
						color: "#fff",
						mb: 1,
						textShadow: "0 0 20px rgba(0,255,255,0.4)",
						letterSpacing: 1.5,
					}}
				>
					Admin Portal
				</Typography>

				<Divider
					sx={{
						borderColor: "rgba(255,255,255,0.15)",
						mb: 1,
						mx: "auto",
						width: "60%",
					}}
				/>

				<Typography
					variant="body2"
					align="center"
					color="rgba(255,255,255,0.7)"
					mb={2}
				>
					Please log in with your administrator credentials
				</Typography>

				<Box display="flex" flexDirection="column" gap={2}>
					<TextField
						id="email"
						name="email"
						label="Email"
						type="email"
						fullWidth
						required
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<EmailIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
								</InputAdornment>
							),
							sx: {
								color: "#fff",
								backgroundColor: "rgba(255,255,255,0.05)",
								borderRadius: 2,
								"& fieldset": { border: "1px solid rgba(255,255,255,0.2)" },
								"&:hover fieldset": { borderColor: "#00f0ff" },
								"&.Mui-focused fieldset": {
									borderColor: Colors.primary,
									boxShadow: `0 0 15px ${Colors.primary}55`,
								},
							},
						}}
						InputLabelProps={{
							sx: { color: "rgba(255,255,255,0.7)" },
						}}
						aria-autocomplete="none"
						autoComplete="off"
					/>
					<TextField
						id="password"
						name="password"
						label="Password"
						type="password"
						fullWidth
						required
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
								</InputAdornment>
							),
							sx: {
								color: "#fff",
								backgroundColor: "rgba(255,255,255,0.05)",
								borderRadius: 2,
								"&.Mui-focused fieldset": {
									borderColor: Colors.primary,
									boxShadow: `0 0 15px ${Colors.primary}55`,
								},
							},
						}}
						InputLabelProps={{
							sx: { color: "rgba(255,255,255,0.7)" },
						}}
					/>
				</Box>

				<Button
					type="submit"
					variant="contained"
					size="large"
					sx={{
						borderRadius: 3,
						fontWeight: 700,
						fontSize: "1.05rem",
						py: 1.4,
						transition: "all 0.35s ease",
						letterSpacing: "0.5px",
					}}
				>
					Log In
				</Button>
			</Paper>

			{process.env.REACT_APP_USE_EMULATOR==='true' && (
				<Box sx={{ color: "white", position: "fixed", bottom: 0 }}>
					Emulator
				</Box>
			)}
		</Box>
	);
};

export default AdminAuthForm;
