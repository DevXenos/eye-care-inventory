import React from "react";
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {
	LucideBoxes,
	LucideAlertTriangle,
	LucidePackage,
	LucideDollarSign
} from "lucide-react";
import Card from "../../../components/Card/Card";
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
	BarChart, Bar
} from "recharts";
import useProducts from "../../../hooks/useProducts";
import useSalesReport from "../../../hooks/useSalesReport";
import useStockHistory from "../../../hooks/useStockHistory";
import usePurchased from "../../../hooks/usePurchased";

const DashboardOverview = () => {
	const { products } = useProducts();
	const { totalSales } = useSalesReport();
	const { stockHistory } = useStockHistory();
	const { purchases } = usePurchased();

	const lowStockThreshold = 10;
	const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold);
	const lowStockCount = lowStockProducts.length;

	// Purchase statuses
	const pendingPurchasesList = purchases.filter(p => p.status === "Pending");

	// Stock-In vs Stock-Out Trend (last 30 days)
	const stockInChartData = stockHistory.slice(-30).map(entry => ({
		date: new Date(entry.date).toLocaleDateString(),
		stockIn: entry.stockAdjustment > 0 ? entry.stockAdjustment : 0,
		stockOut: entry.stockAdjustment < 0 ? Math.abs(entry.stockAdjustment) : 0,
	}));

	// Top 5 products by stock
	const top5Products = [...products]
		.sort((a, b) => b.stock - a.stock)
		.slice(0, 5)
		.map(p => ({ name: p.name, stock: p.stock }));

	// Recent suppliers from purchases (latest 5 unique)
	const recentSuppliersFromPurchases = Array.from(
		new Map(
			purchases
				.slice(-50)
				.reverse()
				.map(p => [p.supplier, p])
		).values()
	).slice(0, 5);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

			{/* Dashboard Title */}
			<Typography variant="h4">Inventory Overview</Typography>

			{/* Top 4 Summary Cards */}
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
				<Card materialIcon={<LucideBoxes />} title='Total Products' value={products.length} />
				<Card materialIcon={<LucideAlertTriangle />} title='Low Stock Items' value={lowStockCount} />
				<Card materialIcon={<LucideDollarSign />} title='Total Sales' value={totalSales} />
				<Card materialIcon={<LucidePackage />} title='Total Stock-In' value={stockHistory.reduce((sum, s) => sum + (s.stockAdjustment > 0 ? s.stockAdjustment : 0), 0)} />
			</Box>

			{/* Charts Row */}
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>
				{/* Stock Movement Chart */}
				<Paper sx={{ flex: 1, p: 2 }}>
					<Typography variant="h6">Stock Movement (In vs Out)</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={stockInChartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="stockIn" stroke="#82ca9d" name="Stock-In" />
							<Line type="monotone" dataKey="stockOut" stroke="#ff4d4f" name="Stock-Out" />
						</LineChart>
					</ResponsiveContainer>
				</Paper>

				{/* Top 5 Products Chart */}
				<Paper sx={{ flex: 1, p: 2 }}>
					<Typography variant="h6">Top 5 Products by Stock</Typography>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={top5Products}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="stock" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</Paper>
			</Box>

			{/* Tables Row */}
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2 }}>

				{/* Low Stock Table */}
				<Paper sx={{ flex: 1, p: 2 }}>
					<Typography variant="h6">Low Stock Alerts</Typography>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Code</TableCell>
									<TableCell>Product</TableCell>
									<TableCell>Stock</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{lowStockProducts.length > 0 ? lowStockProducts.map(p => (
									<TableRow key={p.id}>
										<TableCell>{p.id}</TableCell>
										<TableCell>{p.name}</TableCell>
										<TableCell>{p.stock}</TableCell>
									</TableRow>
								)) : (
									<TableRow>
										<TableCell colSpan={3} align="center">No low stock products</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>

				{/* Pending Purchases Table */}
				<Paper sx={{ flex: 1, p: 2 }}>
					<Typography variant="h6">Pending Purchases</Typography>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Reference</TableCell>
									<TableCell>Supplier</TableCell>
									<TableCell>Products Qty</TableCell>
									<TableCell>Date</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{pendingPurchasesList.length > 0 ? pendingPurchasesList.map(p => (
									<TableRow key={p.id}>
										<TableCell>{p.id}</TableCell>
										<TableCell>{p.supplier}</TableCell>
										<TableCell>{p.products.reduce((sum, pr) => sum + pr.quantity, 0)}</TableCell>
										<TableCell>{new Date(p.date || Date.now()).toLocaleDateString()}</TableCell>
									</TableRow>
								)) : (
									<TableRow>
										<TableCell colSpan={4} align="center">No pending purchases</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>

			</Box>

			{/* Recent Suppliers Table (Full Width) */}
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6">Recent Suppliers</Typography>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Supplier</TableCell>
								<TableCell>Last Purchase Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{recentSuppliersFromPurchases.length > 0 ? recentSuppliersFromPurchases.map(p => (
								<TableRow key={p.id}>
									<TableCell>{p.supplier}</TableCell>
									<TableCell>{new Date(p.date || Date.now()).toLocaleDateString()}</TableCell>
								</TableRow>
							)) : (
								<TableRow>
									<TableCell colSpan={2} align="center">No suppliers found</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>

		</Box>
	);
};

export default DashboardOverview;
