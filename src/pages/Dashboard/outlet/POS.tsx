import Table from '../../../components/UI/Table/Table';
import { LucideSearch, LucideXCircle } from 'lucide-react';
import formatMoney from '../../../utils/formatMoney';
import useProducts from '../../../hooks/useProducts';
import getSortedFieldValues from '../../../utils/getSortedFieldValue';
import outletStyles from '../../../constants/outletStyles';
import useDeviceView from '../../../hooks/useDeviceView';
import combined from '../../../utils/combine';
import StyleSheet from '../../../utils/Stylesheet';
import { useState } from 'react';
import Colors from '../../../constants/Colors';
import ProductCard from '../../../components/Card/ProductCard';
import AnimationButton from '../../../components/material/AnimationButton';
import useCart from '../../../hooks/useCart';
import useSalesReport from '../../../hooks/useSalesReport';
import { toast } from 'sonner';
import useNotifications from '../../../hooks/useNotifications';
import useStockHistory from '../../../hooks/useStockHistory';


const POS = () => {
	const isSmallScreen = useDeviceView();

	const [selectedCategory, setSelectedCategory] = useState('All');
	const [query, setQuery] = useState('');

	// Custom Hooks
	const { isLoading, products, addStock, getStockOf } = useProducts();
	const {
		totalPrice,
		carts,
		addItem: addItemToCart,
		updateQuantity,
		removeItem,
		resetCart
	} = useCart();
	const { addSale } = useSalesReport();
	const { addNotification } = useNotifications();

	const { addStockHistory } = useStockHistory();

	const [customerName, setCustomerName] = useState('');

	const categories = getSortedFieldValues(
		products.filter(product => !product.archived),
		'category'
	);

	// Filter products with category + search query
	const visibleProducts = products.filter(product => {
		if (product.archived) return false;

		const matchesCategory =
			selectedCategory === 'All' || product.category === selectedCategory;

		const matchesQuery =
			query.trim() === '' ||
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
					// first: update all stocks
					Promise.all([
						...carts.map((cart) => addStock(cart.productId, -cart.quantity)),
						...carts.map((cart) => addStockHistory({
							date: Date.now(),
							productName: cart.productName,
							stockAdjustment: -(cart.quantity)
						}))
					])
				)
				.then(() =>
					// then: add notification
					addNotification({
						date: Date.now(),
						title: "Sale completed",
						message: `${customerName || "Customer"} purchased ${carts.length} items.`,
					})
				),
			{
				loading: "Processing payment...",
				success: "Payment successful!",
				error: "Payment failed. Please try again.",
				finally: () => {
					resetCart();
					setCustomerName('');
					
				}
			}
		);
	};

	return (
		<div
			style={combined(
				outletStyles.container,
				!isSmallScreen && { flexDirection: 'row' }
			)}
		>
			{/* Left Side */}
			<div style={combined(
				styles.content,
				!isSmallScreen && styles.windowContent
			)}>
				{/* Search */}
				<div style={styles.searchBox}>
					<LucideSearch size={20} color="gray" />
					<input
						style={styles.searchInput}
						placeholder="Search product..."
						value={query}
						onChange={e => {
							setQuery(e.target.value);
						}}
					/>
				</div>

				{/* Categories */}
				<div style={styles.categoriesContainer}>
					{['All', ...categories].map((category, index) => (
						<AnimationButton
							key={index}
							onClick={() => setSelectedCategory(category)}
							style={combined(
								styles.categoryButton,
								selectedCategory === category && styles.categoryButtonSelected
							)}
						>
							{category}
						</AnimationButton>
					))}
				</div>

				{/* Products Grid */}
				<div style={styles.productsGrid}>
					{isLoading ? (
						<div>Loading...</div>
					) : visibleProducts.length > 0 ? (
						visibleProducts.map((product, index) => (
							<ProductCard
								key={index}
								product={product}
								onClick={() => {
									const currentQty = carts.find(c => c.productId === product.id)?.quantity ?? 0;
									const stock = getStockOf(product.id) ?? 0;

									if (currentQty >= stock) {
										return toast.error(`Cannot add more "${product.name}". Stock limit reached (${stock}).`);
									}

									addItemToCart({
										time: Date.now(),
										productId: product.id,
										productName: product.name,
										productPrice: product.sellPrice,
										productImg: product.imgSrc,
										quantity: 1
									});
								}}
							/>
						))
					) : (
						<p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
							No products found
						</p>
					)}
				</div>
			</div>

			{/* Right Side */}
			<div style={combined(
				styles.content,
				!isSmallScreen && styles.windowContent
			)}>
				<label style={styles.inputBox}>
					Biller
					<input style={styles.input} placeholder='Customer Name' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
				</label>

				<div className="table-container">
					<h2 className="title">Selected Product</h2>
					<Table headers={['#', 'Name', 'Price', 'Quantity', 'Subtotal', '']}>
						{carts
							.slice() // copy to avoid mutating state
							.sort((a, b) => b.time - a.time) // newest first
							.map((cart, index) => (
								<tr key={cart.productId} style={{ userSelect: 'none' }}>
									<td>{index + 1}</td>
									<td>{cart.productName}</td>
									<td style={{ textAlign: 'end' }}>
										{formatMoney(cart.productPrice, '₱')}
									</td>
									<td>
										<div className="action">
											<input
												style={styles.stockInput}
												type="number"
												// min={1}
												// max={getStockOf(cart.productId) ?? 0}
												value={cart.quantity}
												onChange={(e) => {
													/* Id to prevent multi show toast with same error */
													const TOAST_ID = 1000;

													// Convert input to number
													let quantity = Number(e.target.value);

													// Clamp value between 1 and available stock
													const maxStock = getStockOf(cart.productId) ?? 0;
													// if (isNaN(quantity) || quantity < 1) quantity = 1;
													if (quantity < 1) {
														quantity = 1;
														toast.error("Quantity cannot be less than 1.", { id: TOAST_ID });
													} else if (quantity > maxStock) {
														quantity = maxStock;
														toast.error(`Quantity cannot exceed stock (${maxStock}).`, { id: TOAST_ID });
													}

													updateQuantity(cart.productId, quantity);
												}}
											/>
										</div>
									</td>
									<td style={{ textAlign: 'end' }}>
										{formatMoney(cart.quantity * cart.productPrice, '₱')}
									</td>
									<td>
										<div className="actions">
											<LucideXCircle
												className="action"
												onClick={() => {
													removeItem(cart.productId);
													toast.success('Product removed from the cart');
												}}
											/>
										</div>
									</td>
								</tr>
							))}
						<tr>
							<td></td>
							<td>Total</td>
							<td></td>
							<td></td>
							<td style={{ textAlign: 'end' }}>
								<p>{formatMoney(totalPrice, '₱')}</p>
							</td>
							<td></td>
						</tr>
					</Table>
				</div>

				<AnimationButton onClick={handlePay}>Pay</AnimationButton>
			</div>
		</div>
	);
};

export default POS;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
	},
	windowContent: {
		maxWidth: "50%"
	},

	// Category
	categoriesContainer: {
		display: 'flex',
		flexDirection: 'row',
		gap: 12,
		overflowX: 'auto',
	},
	categoryButton: {
		height: 40,
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 8,
		background: Colors.card,
	},
	categoryButtonSelected: {
		background: Colors.primary,
		color: 'white',
	},

	// Products grid
	productsGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
		gap: 12,
	},

	// Search Box
	searchBox: {
		paddingLeft: 12,
		background: Colors.card,
		height: 40,
		display: 'flex',
		alignItems: 'center',
		borderRadius: 999,
		overflow: 'hidden',
		boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
	},
	searchInput: {
		flex: 1,
		padding: '0 12px',
		border: 'none',
		outline: 'none',
		fontSize: 14,
		background: 'transparent',
	},

	inputBox: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
	},
	input: {
		height: 48,
	},

	stockInput: {
		width: 150,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
	}
});
