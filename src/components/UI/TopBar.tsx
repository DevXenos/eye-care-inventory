import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { LucideBell, LucideBellDot, LucideSearch, LucideX } from 'lucide-react';
import StyleSheet from '../../utils/Stylesheet';
import AnimationButton from '../material/AnimationButton';
import { AnimatePresence, motion } from 'framer-motion';
import Colors from '../../constants/Colors';
import useProducts from '../../hooks/useProducts';
import { ProductType } from '../../types/ProductType';
import { toast } from 'sonner';
import useNotifications from '../../hooks/useNotifications';
import Swal from 'sweetalert2';

interface TopBarProps {
	onQuery?: (query: string) => void;
}

const hideQueryOn: string[] = [
	'/dashboard/',
	'dashboard',
	'/dashboard/create-product',
	'/dashboard/generate-barcode',
	'/dashboard/edit-product',
	'/dashboard/create-purchase',
	'/dashboard/edit-purchase',
	'/dashboard/pos',
	'/dashboard/settings',
	'/dashboard/notifications',
];

const TopBar: React.FC<TopBarProps> = ({ onQuery = () => { } }) => {
	const location = useLocation();
	const [query, setQuery] = React.useState<string>('');
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [isNotifOpen, setNotifOpen] = React.useState<boolean>(false);

	const [reachMinimumLimit, setReachMinimumLimit] = React.useState<ProductType | null>(null);
	const threshold = 2000;

	const { products } = useProducts();
	const { notifications, unreadNotif, updateNotification, removeNotification } = useNotifications();

	React.useEffect(() => setQuery(''), [location.pathname]);

	React.useEffect(() => {
		if (!isNotifOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setNotifOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isNotifOpen]);

	React.useEffect(() => {
		if (!products || products.length === 0) {
			setReachMinimumLimit(null);
			return;
		}
		let lowestProduct: ProductType | null = null;
		products.forEach((product) => {
			if (product.stock <= threshold) {
				if (!lowestProduct || product.stock < lowestProduct.stock) {
					lowestProduct = product;
				}
			}
		});
		setReachMinimumLimit(lowestProduct);
	}, [products, threshold]);

	React.useEffect(() => {
		const lastShown = localStorage.getItem('notification-last-show');
		const now = new Date();
		const currentHour = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

		const onClose = () => {
			localStorage.setItem('notification-last-show', currentHour);
			toast.info('Low stock alerts will not appear again this hour.', { duration: 3000 });
		}

		if (reachMinimumLimit && lastShown !== currentHour) {
			const message = `⚠ Low Stock: ${reachMinimumLimit.name} has only ${reachMinimumLimit.stock} left!`;
			toast.warning(message, {
				closeButton: true,
				onAutoClose: onClose,
				onDismiss: onClose,
			});
		}
	}, [reachMinimumLimit]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value.trim();
		onQuery(value);
		setQuery(value);
	};

	const onClearQuery = () => {
		setQuery('');
		onQuery('');
	};

	const getTitle = () => {
		const path = location.pathname.replace('/dashboard', '').trim();
		switch (path) {
			case '/': return 'Dashboard';
			case '/category': return 'Category';
			case '/inventory': return 'Inventory';
			case '/create-product': return 'Create Product';
			case '/edit-product': return 'Edit Product';
			case '/generate-barcode': return 'Generate Barcode';
			case '/purchase': return 'Purchase';
			case '/create-purchase': return 'Create Purchase';
			case '/edit-purchase': return 'Edit Purchase';
			case '/stock-history': return 'Stock History';
			case '/suppliers': return 'Suppliers';
			case '/notifications': return 'Notifications';
			case '/settings': return 'Account Settings';
			case '/pos': return 'POS';
			case '/sales-report': return 'Sales Report';
			default: return path;
		}
	};

	// Auto mark notifications as read when panel opens
	React.useEffect(() => {
		if (isNotifOpen) {
			notifications.forEach((notif) => {
				if (!notif.isRead && notif.id) updateNotification(notif.id, { isRead: true });
			});
		}
	}, [isNotifOpen, notifications, updateNotification]);

	return (
		<div className="topbar">
			<h2 className="label">{getTitle()}</h2>

			{!hideQueryOn.includes(location.pathname) && (
				<div className="search-query">
					<LucideSearch className="icon" />
					<input placeholder="Search..." type="text" value={query} onChange={onChange} />
					<LucideX className="erase" onClick={onClearQuery} />
				</div>
			)}

			{location.pathname !== '/dashboard/pos' && (
				<AnimationButton to="/dashboard/pos" style={styles.posBtn}>POS</AnimationButton>
			)}

			{/* Notication Button */}
			<AnimationButton
				style={{ borderRadius: 999, aspectRatio: 1, padding: 0 }}
				onClick={() => setNotifOpen(!isNotifOpen)}
			>
				{unreadNotif ? <LucideBellDot className="icon" size={24} /> : <LucideBell className="icon" size={24} />}
			</AnimationButton>

			{/* Notification */}
			<AnimatePresence>
				{isNotifOpen && (
					<motion.div
						initial={{ translateX: '100%' }}
						animate={{ translateX: 0 }}
						exit={{ translateX: '100%' }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						style={styles.notificationWindow}
					>
						<div style={styles.notificationOverlay} onClick={() => setNotifOpen(false)}></div>
						<div style={styles.notificationContent} ref={menuRef}>
							<h3 style={styles.notificationHeader}>Notifications</h3>
							<div style={styles.notificationList}>
								{notifications
									.slice()
									.sort((a, b) => b.date - a.date)
									.map((notif) => (
										<div
											key={notif.id}
											style={{
												...styles.notificationItem,
												...(!notif.isRead ? styles.notificationItemUnread : {}),
											}}
										>
											<div style={styles.notificationItemHeader}>
												<h4 style={styles.notificationItemTitle}>{notif.title}</h4>
												<button
													style={styles.notificationDeleteBtn}
													onClick={() => {
														Swal.fire({
															title: `Do you want to delete this notification?`,
															showDenyButton: true,
															confirmButtonText: "Delete",
															denyButtonText: `Cancel`,
															buttonsStyling: true,
															icon: 'warning',
														}).then((result) => {
															if (result.isConfirmed) {
																notif.id && removeNotification(notif.id)
																Swal.fire("Deleted Successfully!", "", "success");
															}
														});
													}}
												>
													&times;
												</button>
											</div>
											<p style={styles.notificationItemMessage}>{notif.message}</p>
											<span style={styles.notificationItemDate}>
												{new Date(notif.date).toLocaleString()}
											</span>
										</div>
									))}
								{notifications.length === 0 && (
									<p style={{ textAlign: 'center', padding: 20, color: '#555' }}>No notifications</p>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TopBar;

// ======== STYLES ========
const styles = StyleSheet.create({
	posBtn: {
		width: 120,
		borderRadius: 999,
	},

	notificationWindow: {
		position: 'fixed',
		inset: 0,
		zIndex: 999,
		display: 'flex',
		flexDirection: 'row',
	},
	notificationOverlay: {
		flex: 1,
	},
	notificationContent: {
		width: '100%',
		maxWidth: 420,
		height: '100%',
		maxHeight: '100vh',
		background: 'rgba(255,255,255,0.85)',
		backdropFilter: 'blur(12px)',
		boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
		display: 'flex',
		flexDirection: 'column',
		paddingTop: 16,
		paddingBottom: 16,
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 20,
		overflowY: 'auto',
	},
	notificationHeader: {
		fontSize: 18,
		fontWeight: 700,
		padding: '0 16px',
		marginBottom: 12,
		color: Colors.primary,
	},
	notificationList: {
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
	},
	notificationItem: {
		padding: '12px 16px',
		display: 'flex',
		flexDirection: 'column',
		gap: 4,
		background: 'transparent',
		cursor: 'pointer',
		transition: '0.3s',
		borderBottom: '1px solid rgba(0,0,0,0.25)',
	},
	notificationItemUnread: {
		background: 'linear-gradient(90deg, rgba(99,102,241,0.1), transparent)',
		borderLeft: `4px solid ${Colors.primary}`,
	},
	notificationItemHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	notificationDeleteBtn: {
		background: 'transparent',
		border: 'none',
		color: '#888',
		fontSize: 30,
		cursor: 'pointer',
		padding: 4,
		transition: '0.2s',
	},
	notificationItemTitle: {
		fontSize: '0.95rem',
		fontWeight: 600,
		color: Colors.primary,
	},
	notificationItemMessage: {
		fontSize: '0.85rem',
		color: '#333',
		lineHeight: 1.4,
	},
	notificationItemDate: {
		fontSize: '0.75rem',
		color: '#666',
		alignSelf: 'flex-end',
	},
});
