import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const useCurrentUser = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// Subscribe to auth state changes
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setIsLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	// Memoize the returned object to prevent unnecessary re-renders
	const memoizedValue = useMemo(() => ({ currentUser, isLoading }), [currentUser, isLoading]);

	return memoizedValue;
};

export default useCurrentUser;
