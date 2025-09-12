import * as React from "react";
import { NotificationType } from "../types/NotificationType";
import { database } from "../config/firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";

const useNotifications = () => {
	const [isLoading, setLoading] = React.useState<boolean>(true);
	const [notifications, setNotifications] = React.useState<NotificationType[]>([]);
	const [unreadNotif, setUnreadNotif] = React.useState<NotificationType | null>(null);

	React.useEffect(() => {
		const notificationsRef = ref(database, "notifications");

		const unsubscribe = onValue(notificationsRef, (snapshot) => {
			const data = snapshot.val();

			if (data) {
				const loaded: NotificationType[] = Object.entries(data).map(
					([id, notif]) => ({
						id, // Firebase auto key
						...(notif as Omit<NotificationType, "id">),
					})
				);
				setNotifications(loaded);
			} else {
				setNotifications([]);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	React.useEffect(() => {
		setUnreadNotif(
			notifications.find((notif) => {
				return !notif.isRead;
			}) ?? null
		);
	}, [notifications]);

	// Add new notification (auto ID with push)
	const addNotification = async (notification: Omit<NotificationType, "id">) => {
		const notificationsRef = ref(database, "notifications");
		const newRef = push(notificationsRef);
		await set(newRef, notification);
	};

	// Update existing notification
	const updateNotification = async (
		id: NotificationType["id"],
		updates: Partial<Omit<NotificationType, "id">>
	) => {
		if (!id) return;
		const notifRef = ref(database, `notifications/${id}`);
		await update(notifRef, updates);
	};

	// Delete notification
	const removeNotification = async (id: NotificationType["id"]) => {
		if (!id) return;
		const notifRef = ref(database, `notifications/${id}`);
		await remove(notifRef);
	};

	return {
		notifications,
		isLoading,
		addNotification,
		updateNotification,
		removeNotification,
		unreadNotif,
	};
};

export default useNotifications;
