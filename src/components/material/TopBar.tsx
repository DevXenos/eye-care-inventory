// components/navigation/TopBar.tsx
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	LucideBell,
	LucideBellDot,
	LucideSearch,
	LucideX,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Colors from "../../constants/Colors";
import useProducts from "../../hooks/useProducts";
import { ProductType } from "../../types/ProductType";
import { toast } from "sonner";
import useNotifications from "../../hooks/useNotifications";
import Swal from "sweetalert2";
import { useQuery } from "../../context/QueryProvider";
import {
	Box,
	Button,
	Typography,
	IconButton,
	InputBase,
	Divider,
	Paper,
} from "@mui/material";

interface TopBarProps {
	onQuery?: (query: string) => void;
}

const hideQueryOn: string[] = [
	"/dashboard/",
	"dashboard",
	"/dashboard/create-product",
	"/dashboard/generate-barcode",
	"/dashboard/edit-product",
	"/dashboard/create-purchase",
	"/dashboard/edit-purchase",
	"/dashboard/pos",
	"/dashboard/settings",
	"/dashboard/notifications",
];

const TopBar: React.FC<TopBarProps> = ({ onQuery = () => { } }) => {
	const { query, setQuery } = useQuery();
	const location = useLocation();
	const navigate = useNavigate();
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [isNotifOpen, setNotifOpen] = React.useState(false);

	const [reachMinimumLimit, setReachMinimumLimit] =
		React.useState<ProductType | null>(null);
	const threshold = 50;

	const { products } = useProducts();
	const { notifications, unreadNotif, updateNotification, removeNotification } =
		useNotifications();

	// ----------------------
	// Handle Click Outside of Notification Menu
	// ----------------------
	React.useEffect(() => {
		if (!isNotifOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setNotifOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isNotifOpen]);

	// ----------------------
	// Detect Low Stock
	// ----------------------
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

	// ----------------------
	// Low Stock Warning Toast
	// ----------------------
	React.useEffect(() => {
		const lastShown = localStorage.getItem("notification-last-show");
		const now = new Date();
		const currentHour = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

		const onClose = () => {
			localStorage.setItem("notification-last-show", currentHour);
			toast.info("Low stock alerts will not appear again this hour.", {
				duration: 3000,
			});
		};

		if (reachMinimumLimit && lastShown !== currentHour) {
			const message = `⚠ Low Stock: ${reachMinimumLimit.name} has only ${reachMinimumLimit.stock} left!`;
			toast.warning(message, {
				closeButton: true,
				onAutoClose: onClose,
				onDismiss: onClose,
			});
		}
	}, [reachMinimumLimit]);

	// ----------------------
	// Search Query Logic
	// ----------------------
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value.trim();
		onQuery(value);
		setQuery(value);
	};

	const onClearQuery = () => {
		setQuery("");
		onQuery("");
	};

	const getTitle = () => {
		const path = location.pathname.replace("/dashboard", "").trim() || "/";

		const paths: Record<string, string> = {
			"/": "Dashboard",
			"/category": "Category",
			"/inventory": "Inventory",
			"/create-product": "Create Product",
			"/edit-product": "Edit Product",
			"/generate-barcode": "Generate Barcode",
			"/purchase": "Purchase",
			"/create-purchase": "Create Purchase",
			"/edit-purchase": "Edit Purchase",
			"/stock-history": "Stock History",
			"/suppliers": "Suppliers",
			"/notifications": "Notifications",
			"/settings": "Account Settings",
			"/pos": "POS",
			"/sales-report": "Sales Report",
		};

		return paths[path] ?? "Dashboard";
	};

	// ----------------------
	// Mark notifications as read when opened
	// ----------------------
	React.useEffect(() => {
		if (isNotifOpen) {
			notifications.forEach((notif) => {
				if (!notif.isRead && notif.id)
					updateNotification(notif.id, { isRead: true });
			});
		}
	}, [isNotifOpen, notifications, updateNotification]);

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				py: 1,
				px: 2,
				borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
				bgcolor: "background.paper",
				position: "sticky",
				top: "1rem",
				mx: "1rem",
				mb: "1rem",
				zIndex: 10,
				borderRadius: 1
			}}
		>
			<Typography variant="h6" fontWeight={700}>
				{getTitle()}
			</Typography>

			<Box
				sx={{
					display: "flex",
					gap: 2,
					alignItems: "center",
					flex: 1,
					justifyContent: "flex-end",
				}}
			>
				{/* Search Bar */}
				{!hideQueryOn.includes(location.pathname) && (
					<Box
						sx={(theme) => ({
							display: "flex",
							alignItems: "center",
							gap: 1,
							flex: 1,
							maxWidth: 400,
							borderRadius: 999,
							px: 2,
							py: 0.5,
							border: `1px solid ${theme.palette.primary.main}`,
							bgcolor: "background.default",
						})}
					>
						<LucideSearch size={20} />
						<InputBase
							value={query}
							onChange={onChange}
							placeholder="Search..."
							sx={{ flex: 1 }}
						/>
						{query && (
							<IconButton size="small" onClick={onClearQuery}>
								<LucideX size={18} />
							</IconButton>
						)}
					</Box>
				)}

				{/* POS Button */}
				{location.pathname !== "/dashboard/pos" && (
					<Button
						onClick={() => navigate("/dashboard/pos")}
						variant="contained"
						sx={{
							borderRadius: 999,
							minWidth: 120,
							textTransform: "none",
							fontWeight: 600,
						}}
					>
						POS
					</Button>
				)}

				{/* Notification Button */}
				<IconButton
					color="primary"
					onClick={() => setNotifOpen(!isNotifOpen)}
					sx={{
						borderRadius: 999,
						width: 44,
						height: 44,
						border: (theme) => `1px solid ${theme.palette.primary.main}`,
					}}
				>
					{unreadNotif ? <LucideBellDot size={22} /> : <LucideBell size={22} />}
				</IconButton>
			</Box>

			{/* ---------------------- */}
			{/* Notifications Drawer */}
			{/* ---------------------- */}
			<AnimatePresence>
				{isNotifOpen && (
					<motion.div
						initial={{ translateX: "100%" }}
						animate={{ translateX: 0 }}
						exit={{ translateX: "100%" }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						style={{
							position: "fixed",
							inset: 0,
							zIndex: 999,
							display: "flex",
						}}
					>
						<Box flex={1} onClick={() => setNotifOpen(false)} />

						<Paper
							ref={menuRef}
							elevation={8}
							sx={{
								width: "100%",
								maxWidth: 420,
								height: "100%",
								bgcolor: "background.paper",
								backdropFilter: "blur(10px)",
								display: "flex",
								flexDirection: "column",
								p: 2,
								borderTopLeftRadius: 2,
								borderBottomLeftRadius: 2,
								overflowY: "auto",
							}}
						>
							<Typography
								variant="subtitle1"
								fontWeight={700}
								sx={{ mb: 2, color: "primary.main" }}
							>
								Notifications
							</Typography>

							{notifications.length === 0 ? (
								<Typography align="center" sx={{ color: "text.secondary" }}>
									No notifications
								</Typography>
							) : (
								notifications
									.slice()
									.sort((a, b) => b.date - a.date)
									.map((notif) => (
										<Box
											key={notif.id}
											sx={{
												p: 1.5,
												borderBottom: "1px solid rgba(0,0,0,0.12)",
												bgcolor: notif.isRead
													? "transparent"
													: "action.hover",
												borderLeft: notif.isRead
													? "none"
													: (theme) => `4px solid ${theme.palette.primary.main}`,
												borderRadius: 1,
												transition: "background 0.2s",
											}}
										>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mb: 0.5,
												}}
											>
												<Typography
													variant="body1"
													fontWeight={600}
													color="primary"
												>
													{notif.title}
												</Typography>
												<IconButton
													size="small"
													onClick={() => {
														Swal.fire({
															title: `Delete this notification?`,
															icon: "warning",
															showDenyButton: true,
															confirmButtonText: "Delete",
															denyButtonText: "Cancel",
														}).then((result) => {
															if (result.isConfirmed && notif.id) {
																removeNotification(notif.id);
																Swal.fire("Deleted!", "", "success");
															}
														});
													}}
												>
													<LucideX size={18} />
												</IconButton>
											</Box>
											<Typography variant="body2">
												{notif.message}
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
												sx={{ display: "block", textAlign: "right", mt: 0.5 }}
											>
												{new Date(notif.date).toLocaleString()}
											</Typography>
										</Box>
									))
							)}
						</Paper>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default TopBar;
