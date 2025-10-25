import React, { useState, useRef, useMemo, useEffect } from "react";
import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { LucideList, LucidePrinter, LucideX } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import useProducts from "../../../hooks/useProducts";
import BarcodeCard from "../../../components/Card/BarcodeCard";

type SelectedProduct = {
	productId?: string | number;
	productName: string;
	quantity: number;
};

const columnsPerRow = 3;
const rowsPerBatch = 3; // lazy render 3 rows per batch

// Print-friendly component
const PrintCoupon = React.forwardRef<HTMLDivElement, { barcodes: { name: string; value: string | number }[] }>(
	({ barcodes }, ref) => (
		<div ref={ref} style={{ padding: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
			{barcodes.map((barcode, index) => (
				<div
					key={index}
					style={{
						width: "30%",
						minWidth: 120,
						border: "1px solid #000",
						borderRadius: 4,
						padding: 5,
						textAlign: "center",
						pageBreakInside: "avoid",
					}}
				>
					<Barcode value={String(barcode.value)} width={1.5} height={50} displayValue />
					<div style={{ fontSize: 12 }}>{barcode.name}</div>
				</div>
			))}
		</div>
	)
);

const GenerateBarCode: React.FC = () => {
	const { isLoading, products } = useProducts();
	const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

	// Screen lazy render
	const [visibleRows, setVisibleRows] = useState(rowsPerBatch);
	const contentRef = useRef<HTMLDivElement>(null);
	const lastRowRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Hidden print ref
	const printRef = useRef<HTMLDivElement>(null);

	// Add or increase product
	const handleAddProduct = (productId: string | number | undefined, productName: string) => {
		const existing = selectedProducts.find((p) => p.productId === productId);
		if (existing) {
			setSelectedProducts((prev) =>
				prev.map((p) => (p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p))
			);
		} else {
			setSelectedProducts((prev) => [...prev, { productId, productName, quantity: 1 }]);
		}
	};

	const handleQuantityChange = (productId: string | number | undefined, quantity: number) => {
		if (quantity < 1) quantity = 1;
		setSelectedProducts((prev) =>
			prev.map((p) => (p.productId === productId ? { ...p, quantity } : p))
		);
	};

	const handleRemoveProduct = (productId: string | number | undefined) => {
		setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
	};

	// Flatten selected products
	const flatBarcodes = useMemo(() => {
		const arr: { name: string; value: string | number }[] = [];
		selectedProducts.forEach((product) => {
			for (let i = 0; i < product.quantity; i++) {
				arr.push({ name: product.productName, value: product.productId ?? product.productName });
			}
		});
		return arr;
	}, [selectedProducts]);

	// Group for screen lazy render
	const barcodeRows = useMemo(() => {
		const rows: { name: string; value: string | number }[][] = [];
		for (let i = 0; i < flatBarcodes.length; i += columnsPerRow) {
			rows.push(flatBarcodes.slice(i, i + columnsPerRow));
		}
		return rows;
	}, [flatBarcodes]);

	// Intersection Observer for lazy screen render
	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect();
		observerRef.current = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					setVisibleRows((prev) => Math.min(prev + rowsPerBatch, barcodeRows.length));
				}
			},
			{ root: contentRef.current, rootMargin: "0px", threshold: 1 }
		);
		if (lastRowRef.current) observerRef.current.observe(lastRowRef.current);
		return () => observerRef.current?.disconnect();
	}, [barcodeRows, visibleRows]);

	// Print function
	const reactToPrintFn = useReactToPrint({
		contentRef: printRef,
		documentTitle: "Barcodes",
	});

	return (
		<Box sx={{ p: 2, display: "flex", flexDirection: { xs: "row", sm: "column" }, gap: 3 }}>
			{/* Top Button */}
			<Box display="flex" justifyContent="flex-end">
				<Button startIcon={<LucideList />} href="../inventory" variant="outlined">
					Product List
				</Button>
			</Box>

			{/* Columns */}
			<Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" } }}>
				{/* Left Column */}
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5">Select Products</Typography>
					<Box sx={{
						display: "grid", gap: 2, maxHeight: 500, pb: 2, overflowY: "auto", gridTemplateColumns: {
							xs: '1fr',
							md: 'repeat(3, 1fr)',
						}
					}}>
						{isLoading ? (
							<Typography>Loading...</Typography>
						) : (
							products.map((product) => (
								<BarcodeCard
									code={product.id}
									name={product.name}
									onClick={() => handleAddProduct(product.id, product.name)}
								/>
							))
						)}
					</Box>
				</Box>

				{/* Right Column */}
				<Paper sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					<Typography variant="h5">Selected Products</Typography>
					{selectedProducts.length === 0 ? (
						<Typography>No products selected</Typography>
					) : (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="center">Quantity</TableCell>
										<TableCell align="center">Remove</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{selectedProducts.map((product) => {
										const originalProduct = products.find((p) => p.id === product.productId);
										const maxStock = originalProduct?.stock ?? 9999; // fallback if stock is undefined

										return (
											<TableRow key={product.productId ?? product.productName}>
												<TableCell>{product.productName}</TableCell>
												<TableCell align="center">
													<TextField
														type="number"
														size="small"
														value={product.quantity}
														onChange={(e) => {
															let value = Number(e.target.value);
															if (value < 1) value = 1;
															if (value > maxStock) value = maxStock;
															handleQuantityChange(product.productId, value);
														}}
														inputProps={{ min: 1, max: maxStock }}
														sx={{ width: 80 }}
													/>
												</TableCell>
												<TableCell align="center">
													<IconButton color="error" onClick={() => handleRemoveProduct(product.productId)}>
														<LucideX />
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					)}

					<Button
						variant="contained"
						startIcon={<LucidePrinter />}
						onClick={reactToPrintFn}
						disabled={selectedProducts.length === 0}
					>
						Print Barcodes
					</Button>
				</Paper>
			</Box>

			{/* Lazy Preview */}
			<Paper
				ref={contentRef}
				sx={{
					maxHeight: 800,
					overflowY: "auto",
					border: "1px dashed #ddd",
					p: 1,
					display: "flex",
					flexDirection: "column",
					gap: 1,
				}}
			>
				{barcodeRows.slice(0, visibleRows).map((row, rowIndex) => {
					const isLast = rowIndex === visibleRows - 1;
					return (
						<Box key={rowIndex} ref={isLast ? lastRowRef : null} sx={{ display: "flex", gap: 1 }}>
							{row.map((barcode, index) => (
								<Box
									key={`${barcode.value}-${index}`}
									sx={{
										flex: 1,
										border: "1px solid #ddd",
										borderRadius: 1,
										padding: 1,
										textAlign: "center",
									}}
								>
									<Barcode value={String(barcode.value)} width={1.5} height={50} displayValue />
									<Typography variant="caption">{barcode.name}</Typography>
								</Box>
							))}
						</Box>
					);
				})}
			</Paper>

			{/* Hidden Print */}
			<div style={{ display: "none" }}>
				<PrintCoupon ref={printRef} barcodes={flatBarcodes} />
			</div>
		</Box>
	);
};

export default GenerateBarCode;
