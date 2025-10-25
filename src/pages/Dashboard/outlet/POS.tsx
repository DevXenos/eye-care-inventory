import React, { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Chip,
	Divider,
	IconButton,
	InputAdornment,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	Paper,
} from "@mui/material";
import { LucideSearch, LucideXCircle } from "lucide-react";
import formatMoney from "../../../utils/formatMoney";
import useProducts from "../../../hooks/useProducts";
import useCart from "../../../hooks/useCart";
import useSalesReport from "../../../hooks/useSalesReport";
import useNotifications from "../../../hooks/useNotifications";
import useStockHistory from "../../../hooks/useStockHistory";
import getSortedFieldValues from "../../../utils/getSortedFieldValue";
import { toast } from "sonner";
import { ReceiptWrapper } from "../../../components/material/Receipt";
import POSCard from "../../../components/Card/POSCard";

const POS = () => {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [query, setQuery] = useState("");
	const [customerName, setCustomerName] = useState("");
	const [showReceipt, setShowReceipt] = useState(false);
	const [receiptData, setReceiptData] = useState<any>(null);

	const { isLoading, products, addStock, getStockOf } = useProducts();
	const { totalPrice, carts, addItem, updateQuantity, removeItem, resetCart } = useCart();
	const { addSale } = useSalesReport();
	const { addNotification } = useNotifications();
	const { addStockHistory } = useStockHistory();

	const categories = getSortedFieldValues(products.filter(p => !p.archived), "category");

	const visibleProducts = products.filter(product => {
		if (product.archived) return false;
		const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
		const matchesQuery =
			query.trim() === "" ||
			product.name.toLowerCase().includes(query.toLowerCase()) ||
			String(product.id).toLowerCase().includes(query.toLowerCase());
		return matchesCategory && matchesQuery;
	});

	const handlePay = async () => {
		if (!customerName) return toast.error("Please enter the customer's name.");
		if (carts.length === 0) return toast.error("Please select at least one product.");

		toast.promise(
			addSale({
				carts,
				date: Date.now(),
				customer: customerName,
				amount: totalPrice,
			})
				.then(() =>
					Promise.all([
						...carts.map(cart => addStock(cart.productId, -cart.quantity)),
						...carts.map(cart =>
							addStockHistory({
								date: Date.now(),
								productName: cart.productName,
								stockAdjustment: -cart.quantity,
							})
						),
					])
				)
				.then(() =>
					addNotification({
						date: Date.now(),
						title: "Sale completed",
						message: `${customerName || "Customer"} purchased ${carts.length} items.`,
					})
				)
				.then(() => {
					setReceiptData({
						customer: customerName,
						carts,
						total: totalPrice,
						date: Date.now(),
					});
					setShowReceipt(true);
				}),
			{
				loading: "Processing payment...",
				success: "Payment successful!",
				error: "Payment failed. Please try again.",
				finally: () => {
					resetCart();
					setCustomerName("");
				},
			}
		);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2 }}>
			{/* Left: Products */}
			<Paper
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 2,
					overflow: "hidden",
				}}
			>
				{/* Search + Categories */}
				<Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
					<TextField
						fullWidth
						placeholder="Search product..."
						variant="outlined"
						value={query}
						onChange={e => setQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LucideSearch size={18} />
								</InputAdornment>
							),
						}}
					/>
					<Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 0.5 }}>
						{["All", ...categories].map((category, idx) => (
							<Chip
								key={idx}
								label={category}
								color={selectedCategory === category ? "primary" : "default"}
								onClick={() => setSelectedCategory(category)}
							/>
						))}
					</Box>
				</Box>

				{/* Products Grid */}
				<Box
					sx={{
						display: "grid",
						gap: 2,
						p: 1,
						gridTemplateColumns: {
							xs: "repeat(1, 1fr)",
							sm: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
							lg: "repeat(4, 1fr)",
						},
					}}
				>
					{isLoading ? (
						<Typography>Loading...</Typography>
					) : visibleProducts.length > 0 ? (
						visibleProducts.map(product => (
							// <Card key={product.id} sx={{ display: "flex", flexDirection: "column", height: 200 }}>
							// 	<CardActionArea
							// 		sx={{ flex: 1 }}
							// 		onClick={() => {
							// 			const currentQty = carts.find(c => c.productId === product.id)?.quantity ?? 0;
							// 			const stock = getStockOf(product.id) ?? 0;
							// 			if (currentQty >= stock) {
							// 				return toast.error(`Cannot add more "${product.name}". Stock limit reached (${stock}).`);
							// 			}
							// 			addItem({
							// 				time: Date.now(),
							// 				productId: product.id,
							// 				productName: product.name,
							// 				productPrice: product.sellPrice,
							// 				productImg: product.imgSrc,
							// 				quantity: 1,
							// 			});
							// 		}}
							// 	>
							// 		{product.imgSrc && <CardMedia component="img" height="100" image={product.imgSrc} alt={product.name} />}
							// 		<CardContent>
							// 			<Typography variant="subtitle1" noWrap>{product.name}</Typography>
							// 			<Typography variant="body2" color="text.secondary">{formatMoney(product.sellPrice, "₱")}</Typography>
							// 		</CardContent>
							// 	</CardActionArea>
							// </Card>
							<POSCard
								product={product}
								onClick={() => {
									const currentQty = carts.find(c => c.productId === product.id)?.quantity ?? 0;
									const stock = getStockOf(product.id) ?? 0;
									if (currentQty >= stock) {
										return toast.error(`Cannot add more "${product.name}". Stock limit reached (${stock}).`);
									}
									addItem({
										time: Date.now(),
										productId: product.id,
										productName: product.name,
										productPrice: product.sellPrice,
										productImg: product.imgSrc,
										quantity: 1,
									});
								}}
							/>
						))
					) : (
						<Typography>No products found</Typography>
					)}
				</Box>
			</Paper>

			{/* Right: Cart + Pay */}
			<Paper
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 2,
					overflow: "hidden",
					p: 2,
				}}
			>
				<TextField label="Customer Name" fullWidth value={customerName} onChange={e => setCustomerName(e.target.value)} />

				<Typography variant="h6">Selected Products</Typography>
				<TableContainer sx={{ flex: 1, overflowY: "auto" }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Name</TableCell>
								<TableCell align="right">Price</TableCell>
								<TableCell align="center">Qty</TableCell>
								<TableCell align="right">Subtotal</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{carts
								.slice()
								.sort((a, b) => b.time - a.time)
								.map((cart, idx) => (
									<TableRow key={cart.productId}>
										<TableCell>{idx + 1}</TableCell>
										<TableCell>{cart.productName}</TableCell>
										<TableCell align="right">{formatMoney(cart.productPrice, "₱")}</TableCell>
										<TableCell align="center">
											<TextField
												type="number"
												size="small"
												value={cart.quantity}
												onChange={e => {
													let quantity = Number(e.target.value);
													const maxStock = getStockOf(cart.productId) ?? 0;
													if (quantity < 1) {
														quantity = 1;
														toast.error("Quantity cannot be less than 1.");
													} else if (quantity > maxStock) {
														quantity = maxStock;
														toast.error(`Quantity cannot exceed stock (${maxStock}).`);
													}
													updateQuantity(cart.productId, quantity);
												}}
												inputProps={{ min: 1 }}
												sx={{ width: 80 }}
											/>
										</TableCell>
										<TableCell align="right">{formatMoney(cart.quantity * cart.productPrice, "₱")}</TableCell>
										<TableCell>
											<IconButton onClick={() => removeItem(cart.productId)}>
												<LucideXCircle size={18} />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							<TableRow>
								<TableCell colSpan={4} align="right">
									<b>Total</b>
								</TableCell>
								<TableCell align="right">{formatMoney(totalPrice, "₱")}</TableCell>
								<TableCell />
							</TableRow>
						</TableBody>
					</Table>

					<Button sx={{ width: "100%"}} variant="contained" onClick={handlePay}>
						Pay
					</Button>

				</TableContainer>

			</Paper>

			{/* Receipt */}
			{showReceipt && receiptData && (
				<ReceiptWrapper
					customer={receiptData.customer}
					carts={receiptData.carts}
					total={receiptData.total}
					date={receiptData.date}
					onClose={() => setShowReceipt(false)}
				/>
			)}
		</Box>
	);
};

export default POS;
