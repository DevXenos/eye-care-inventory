/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, User, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const useCurrentUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setIsLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Change password function
	const changePassword = async (currentPassword: string, newPassword: string) => {
		if (!currentUser || !currentUser.email) throw new Error("No user logged in");

		// Re-authenticate user
		const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
		await reauthenticateWithCredential(currentUser, credential);

		// Update password
		await updatePassword(currentUser, newPassword);
	};

	// Change profile picture function
	const changeProfilePicture = async (photoURL: string) => {
		if (!currentUser) throw new Error("No user logged in");
		await updateProfile(currentUser, { photoURL });
		setCurrentUser({ ...currentUser, photoURL } as User);
	};

	// Change display name function
	const changeUserName = async (displayName: string) => {
		if (!currentUser) throw new Error("No user logged in");
		await updateProfile(currentUser, { displayName });
		setCurrentUser({ ...currentUser, displayName } as User);
	};

	// New function: update both name and profile picture
	const updateProfileInfo = async (displayName?: string|null, photoURL?: string|null) => {
		if (!currentUser) throw new Error("No user logged in");

		const updates: { displayName?: string; photoURL?: string } = {};
		if (displayName) updates.displayName = displayName;
		if (photoURL) updates.photoURL = photoURL;

		await updateProfile(currentUser, updates);

		// Update local state
		setCurrentUser({ ...currentUser, ...updates } as User);
	};

	const memoizedValue = useMemo(
		() => ({
			currentUser,
			isLoading,
			changePassword,
			changeProfilePicture,
			changeUserName,
			updateProfileInfo,
		}),
		[currentUser, isLoading]
	);

	return memoizedValue;
};

export default useCurrentUser;
