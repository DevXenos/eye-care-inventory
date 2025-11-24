const showNotification = (message: string) => {
	Notification.requestPermission().then((permission) => {
		new Notification(message);
	});
}

export default showNotification;