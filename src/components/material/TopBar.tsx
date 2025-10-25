import * as React from "react";
import { useLocation } from "react-router-dom";
import {
	LucideBell,
	LucideBellDot,
	LucideSearch,
	LucideX,
} from "lucide-react";
import AnimationButton from "../material/AnimationButton";
import { AnimatePresence, motion } from "framer-motion";
import Colors from "../../constants/Colors";
import useProducts from "../../hooks/useProducts";
import { ProductType } from "../../types/ProductType";
import { toast } from "sonner";
import useNotifications from "../../hooks/useNotifications";
import Swal from "sweetalert2";
import { useQuery } from "../../context/QueryProvider";
import { Box, Button, Typography, IconButton } from "@mui/material";

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
	const menuRef = React.useRef<HTMLDivElement>(null);
	const [isNotifOpen, setNotifOpen] = React.useState(false);

	const [reachMinimumLimit, setReachMinimumLimit] =
		React.useState<ProductType | null>(null);
	const threshold = 2000;

	const { products } = useProducts();
	const { notifications, unreadNotif, updateNotification, removeNotification } =
		useNotifications();

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
		const path = location.pathname.replace("/dashboard", "").trim();
		switch (path) {
			case "/":
				return "Dashboard";
			case "/category":
				return "Category";
			case "/inventory":
				return "Inventory";
			case "/create-product":
				return "Create Product";
			case "/edit-product":
				return "Edit Product";
			case "/generate-barcode":
				return "Generate Barcode";
			case "/purchase":
				return "Purchase";
			case "/create-purchase":
				return "Create Purchase";
			case "/edit-purchase":
				return "Edit Purchase";
			case "/stock-history":
				return "Stock History";
			case "/suppliers":
				return "Suppliers";
			case "/notifications":
				return "Notifications";
			case "/settings":
				return "Account Settings";
			case "/pos":
				return "POS";
			case "/sales-report":
				return "Sales Report";
			default:
				return path;
		}
	};

	React.useEffect(() => {
		if (isNotifOpen) {
			notifications.forEach((notif) => {
				if (!notif.isRead && notif.id)
					updateNotification(notif.id, { isRead: true });
			});
		}
	}, [isNotifOpen, notifications, updateNotification]);

	return (
		<Box sx={{ bgColor: "red", width: "100%", display: "flex", alignItems: "center", gap: 2, py: 1, px: 2 }}>
			<Typography variant="h6" fontWeight={700}>
				{getTitle()}
			</Typography>

			<Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
				
				{!hideQueryOn.includes(location.pathname) && (
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: 1,
							flex: 1,
							maxWidth: 400,
							borderRadius: 999,
							px: 2,
							py: 1,
						}}
					>
						<LucideSearch size={20} />
						<input
							value={query}
							onChange={onChange}
							placeholder="Search..."
							style={{
								flex: 1,
								border: "none",
								outline: "none",
								background: "transparent",
								fontSize: "0.9rem",
							}}
						/>
						<IconButton size="small" onClick={onClearQuery}>
							<LucideX size={18} />
						</IconButton>
					</Box>
				)}

				{location.pathname !== "/dashboard/pos" && (
					<AnimationButton to="/dashboard/pos" style={{ width: 120, borderRadius: 999 }}>
						POS
					</AnimationButton>
				)}

				<Button
					variant="outlined"
					sx={{ borderRadius: 999, aspectRatio: "1 / 1" }}
					onClick={() => setNotifOpen(!isNotifOpen)}
				>
					{unreadNotif ? (
						<LucideBellDot size={24} />
					) : (
						<LucideBell size={24} />
					)}
				</Button>
			</Box>

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
							flexDirection: "row",
						}}
					>
						<Box sx={{ flex: 1 }} onClick={() => setNotifOpen(false)} />

						<Box
							ref={menuRef}
							sx={{
								width: "100%",
								maxWidth: 420,
								height: "100%",
								bgcolor: "rgba(255,255,255,0.85)",
								backdropFilter: "blur(12px)",
								boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
								display: "flex",
								flexDirection: "column",
								borderTopLeftRadius: 2,
								borderBottomLeftRadius: 2,
								overflowY: "auto",
								p: 2,
							}}
						>
							<Typography
								variant="subtitle1"
								fontWeight={700}
								sx={{ mb: 2, color: Colors.primary }}
							>
								Notifications
							</Typography>

							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								{notifications
									.slice()
									.sort((a, b) => b.date - a.date)
									.map((notif) => (
										<Box
											key={notif.id}
											sx={{
												p: 2,
												display: "flex",
												flexDirection: "column",
												gap: 0.5,
												borderBottom: "1px solid rgba(0,0,0,0.25)",
												bgcolor: notif.isRead
													? "transparent"
													: "rgba(99,102,241,0.1)",
												borderLeft: notif.isRead
													? "none"
													: `4px solid ${Colors.primary}`,
											}}
										>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												}}
											>
												<Typography
													variant="body1"
													fontWeight={600}
													color={Colors.primary}
												>
													{notif.title}
												</Typography>
												<IconButton
													size="small"
													onClick={() => {
														Swal.fire({
															title: `Do you want to delete this notification?`,
															showDenyButton: true,
															confirmButtonText: "Delete",
															denyButtonText: `Cancel`,
															buttonsStyling: true,
															icon: "warning",
														}).then((result) => {
															if (result.isConfirmed) {
																notif.id && removeNotification(notif.id);
																Swal.fire("Deleted Successfully!", "", "success");
															}
														});
													}}
												>
													<LucideX size={20} />
												</IconButton>
											</Box>

											<Typography variant="body2">{notif.message}</Typography>
											<Typography variant="caption" color="text.secondary" align="right">
												{new Date(notif.date).toLocaleString()}
											</Typography>
										</Box>
									))}
								{notifications.length === 0 && (
									<Typography
										sx={{ textAlign: "center", py: 2, color: "#555" }}
									>
										No notifications
									</Typography>
								)}
							</Box>
						</Box>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default TopBar;
