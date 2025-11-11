import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Avatar, Button } from "@mui/material";

export type ProfileFormData = {
	name: string | null;
	profile: string | null; // Base64 or URL
}

type Props = {
	profile: ProfileFormData;
	onSubmit?: (data: ProfileFormData) => void;
};

const ProfileForm: React.FC<Props> = ({ profile, onSubmit }) => {
	const [displayName, setDisplayName] = useState(profile.name || "");
	const [preview, setPreview] = useState(profile.profile || "");

	useEffect(() => {
		setDisplayName(profile.name || "");
		setPreview(profile.profile || "");
	}, [profile]);

	// Convert File to Base64
	const convertFileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (err) => reject(err);
		});
	};

	// Handle clicking on preview to select new file
	const handlePreviewClick = async () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = async (e: Event) => {
			const target = e.target as HTMLInputElement;
			const file = target.files?.[0];
			if (!file) return;
			const base64 = await convertFileToBase64(file);
			setPreview(base64);
		};
		input.click();
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap={3}
			p={3}
			alignItems="center"
		>
			<Typography variant="h5">Update Profile</Typography>

			{/* Profile Picture */}
			<Box
				onClick={handlePreviewClick}
				sx={{
					width: 150,
					height: 150,
					borderRadius: "50%",
					cursor: "pointer",
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: preview ? "transparent" : "#eee",
					"&:hover": {
						opacity: 0.8,
					},
				}}
			>
				{preview ? (
					<Avatar
						src={preview}
						alt="Profile"
						sx={{ width: 150, height: 150 }}
					/>
				) : (
					<Typography color="text.secondary" variant="body2" textAlign="center">
						Click to upload profile
					</Typography>
				)}
			</Box>

			{/* Name Input */}
			<TextField
				label="Name"
				value={displayName}
				onChange={(e) => setDisplayName(e.target.value)}
				fullWidth
			/>

			<Button
				variant="contained"
				color="primary"
				onClick={() =>
					onSubmit?.({
						name: displayName,
						profile: preview,
					})
				}
			>
				Save Changes
			</Button>
		</Box>
	);
};

export default ProfileForm;
