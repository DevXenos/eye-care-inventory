import { LucideShieldCheck, LucideUserCog } from "lucide-react";
import * as React from "react";
import { Box, Button, Card, Avatar, Typography, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import MaterialDialog from "../../../components/material/MaterialDialog";
import PasswordForm, { PasswordFormData } from "../../../components/Form/PasswordForm";
import ProfileForm, { ProfileFormData } from "../../../components/Form/ProfileForm";
import useCurrentUser from "../../../hooks/useCurrentUser";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

const Settings: React.FC = () => {
	const [showChangePassForm, setShowChangePassForm] = React.useState(false);
	const [showEditProfile, setShowEditProfile] = React.useState(false);

	const { isLoading: isCurrentUserLoading, currentUser, changePassword, updateProfileInfo } =
		useCurrentUser();

	if (isCurrentUserLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
				<Typography variant="h6">Loading...</Typography>
			</Box>
		);
	}

	const onChangePassword = ({ currentPassword, newPassword }: PasswordFormData) => {
		setShowChangePassForm(false);

		toast.promise(changePassword(currentPassword, newPassword), {
			loading: "Changing password...",
			success: "Password changed successfully.",
			error: "Failed to change password. Check your current password!",
		});
	};

	const onChangeProfile = ({ name, profile }: ProfileFormData) => {
		setShowEditProfile(false);
		toast.promise(updateProfileInfo(name, profile), {
			loading: "Updating profile...",
			success: "Profile updated successfully.",
			error: (e) => `Failed to update profile. ${e?.getMessage() ?? ""}`,
			finally: () => window.location.reload(),
		});
	};

	return (
		<Box maxWidth={600} mx="auto" mt={4} display="flex" flexDirection="column" gap={4}>
			{/* Profile Header */}
			<Card sx={{ textAlign: "center", p: 4, borderRadius: 3, boxShadow: 3 }}>
				<Box position="relative" display="inline-block" mb={2}>
					<Avatar
						src={currentUser?.photoURL ?? "/placeholder/user.png"}
						alt="User Avatar"
						sx={{ width: 120, height: 120 }}
					/>
				</Box>
				<Typography variant="h5" fontWeight={600}>
					{currentUser?.displayName || "Name"}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{currentUser?.email || "@justinegonzales"}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Member since March 2024
				</Typography>
			</Card>

			{/* Quick Actions */}
			<Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
				<Typography variant="subtitle1" fontWeight={600} mb={2}>
					Quick Actions
				</Typography>
				<Stack direction="row" spacing={2}>
					<Button
						variant="outlined"
						startIcon={<LucideUserCog />}
						onClick={() => setShowEditProfile(true)}
						fullWidth
					>
						Edit Profile
					</Button>
					<Button
						variant="outlined"
						startIcon={<LucideShieldCheck />}
						onClick={() => setShowChangePassForm(true)}
						fullWidth
					>
						Change Password
					</Button>
				</Stack>
			</Card>

			<Button
				variant="contained"
				color="error"
				fullWidth
				sx={{ borderRadius: 2 }}
				onClick={() => {
					toast.promise(
						signOut(auth),
						{
							loading: "Signing out...",
							success: "Logout Successfully!"
						}
					)
				}}
			>
				Log out
			</Button>

			{/* Dialogs */}
			<AnimatePresence>
				{showChangePassForm && (
					<MaterialDialog
						contentStyle={{ maxWidth: 500, width: "100%" }}
						closeOnClickOutside
						onClose={() => setShowChangePassForm(false)}
					>
						<PasswordForm
							onSubmit={onChangePassword}
							onCancel={() => setShowChangePassForm(false)}
						/>
					</MaterialDialog>
				)}

				{showEditProfile && (
					<MaterialDialog
						contentStyle={{ maxWidth: 500, width: "100%" }}
						closeOnClickOutside
						onClose={() => setShowEditProfile(false)}
					>
						<ProfileForm
							onSubmit={onChangeProfile}
							profile={{
								name: currentUser?.displayName ?? "",
								profile: currentUser?.photoURL ?? "",
							}}
						/>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default Settings;
