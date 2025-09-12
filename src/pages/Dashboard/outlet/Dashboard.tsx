import {
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Card } from './../../../components/Card/Card';
import Table from '../../../components/UI/Table/Table';
import {
	LucideBox,
	LucideBoxes,
	LucideSliders,
	LucideAlertTriangle,
	LucidePackage,
	LucideDollarSign
} from 'lucide-react';
import useProducts from '../../../hooks/useProducts';
import StyleSheet from '../../../utils/Stylesheet';
import useSalesReport from '../../../hooks/useSalesReport';
import { ProductType } from '../../../types/ProductType';

// ✅ Simulated data — for temporary display
const stockIns = [
	{ date: '2025-07-10', quantity: 30 },
	{ date: '2025-07-11', quantity: 60 },
	{ date: '2025-07-12', quantity: 50 },
	{ date: '2025-07-13', quantity: 75 },
	{ date: '2025-07-14', quantity: 40 },
	{ date: '2025-07-15', quantity: 25 },
];

const recentPurchases = [
	{ id: 'PO-1001', date: '2025-07-12', supplier: 'Clear Vision Inc.', totalQuantity: 50 },
	{ id: 'PO-1002', date: '2025-07-13', supplier: 'VisionPro Corp.', totalQuantity: 75 },
	{ id: 'PO-1003', date: '2025-07-14', supplier: 'OptiCare Supply', totalQuantity: 40 },
];

const top5InStockProducts = [
	{ id: 'P-001', name: 'Eye Drops 10ml', stock: 120 },
	{ id: 'P-002', name: 'Lens - Grade 1.25', stock: 100 },
	{ id: 'P-003', name: 'Frames - Model X', stock: 95 },
	{ id: 'P-004', name: 'Lens Cleaner 50ml', stock: 88 },
	{ id: 'P-005', name: 'Contact Lens Case', stock: 70 },
];

// ✅ Prepare data for chart (stock in trends)
const stockInChartData = (() => {
	const grouped: Record<string, number> = {};
	stockIns.forEach(entry => {
		const date = new Date(entry.date).toLocaleDateString();
		grouped[date] = (grouped[date] || 0) + entry.quantity;
	});
	return Object.entries(grouped).map(([date, quantity]) => ({ date, quantity }));
})();

const Dashboard = () => {

	const threshold = 10;

	const { products, totalStocks } = useProducts();
	const { totalSales } = useSalesReport();

	return (
		<div className="outlet dashboard-page">
			<h1 className="dashboard-title">Inventory Overview</h1>

			<div style={styles.cardContainer}>
				<Card materialIcon={<LucideBoxes />} title='Total Products' value={products.length} />
				<Card materialIcon={<LucideAlertTriangle />} title='Low Stock Items' value={2} />
				<Card materialIcon={<LucidePackage />} title='Total Stock-In (This Month)' value={totalStocks||0} />
				<Card materialIcon={<LucideDollarSign />} title='Total Sales' value={totalSales} />
			</div>

			<div className="table-container line-graph">
				<h2 className='title'>
					Stock-In Overview
					<nav><LucideSliders /></nav>
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={stockInChartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="quantity" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</div>

			<div className="table-container recent-purchases-table">
				<h2 className='title'>Recent Purchases</h2>
				<Table headers={['Date', 'Reference', 'Supplier', 'Quantity']} emptyMessage="No recent purchases available.">
					{[...recentPurchases, ...Array(5 - recentPurchases.length).fill(null)].slice(0, 5).map((entry, index) => (
						<tr key={entry?.id || `empty-${index}`}>
							<td>{entry ? new Date(entry.date).toLocaleDateString() : '-'}</td>
							<td>{entry ? entry.id : '-'}</td>
							<td>{entry ? entry.supplier : '-'}</td>
							<td>{entry ? entry.totalQuantity : '-'}</td>
						</tr>
					))}
				</Table>
			</div>

			<div className='table-container bar-graph'>
				<h2 className='title'>
					Top 5 Stocked Products
					<nav><LucideSliders /></nav>
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={top5InStockProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Bar dataKey="stock" fill="#82ca9d" />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="table-container top-5-products-table">
				<h2 className='title'>Top 5 Stocked Products</h2>
				<Table headers={['Code', 'Product', 'In Stock']} emptyMessage="No product data available.">
					{top5InStockProducts.map(product => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.name}</td>
							<td>{product.stock}</td>
						</tr>
					))}
				</Table>
			</div>
		</div>
	);
};

export default Dashboard;

const styles = StyleSheet.create({
	cardContainer: {
		gridColumn: "1/-1",
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: 12,
	},
});