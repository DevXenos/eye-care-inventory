import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "../material/Button";

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
		<div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 20 }}>
			<h2>Update Profile</h2>

			<div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", alignItems: "center" }}>
				{preview ? (
					<img
						src={preview}
						alt="Profile"
						style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
						onClick={handlePreviewClick}
						title="Click to change profile"
					/>
				) : (
					<p style={{ color: "#999" }}>No profile picture</p>
				)}
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				<label>Name</label>
				<input
					type="text"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					placeholder="Enter your name"
					aria-label="name"
					style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
				/>
			</div>

			<Button
				onClick={() => onSubmit?.({
					name: displayName,
					profile: preview
				})}
			>
				Save Changes
			</Button>
		</div>
	);
};

export default ProfileForm;
