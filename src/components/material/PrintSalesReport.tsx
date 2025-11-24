// components/material/PrintSalesReport.tsx
import * as React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
	Box,
	Button,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Divider,
	Paper,
} from "@mui/material";
import formatMoney from "../../utils/formatMoney";
import formatDate from "../../utils/formatDate";
import { SalesType } from "../../types/SalesType";

// ----------------------
// Printable SalesReport Component
// ----------------------
type PrintSalesReportProps = {
	filteredSales: SalesType[];
	startDate: string;
	endDate: string;
};

const SalesReportPrint = React.forwardRef<HTMLDivElement, PrintSalesReportProps>(
	({ filteredSales, startDate, endDate }, ref) => {
		const totalAmount = filteredSales.reduce((sum, s) => sum + s.amount, 0);

		return (
			<Box ref={ref} p={5} fontFamily="monospace">
				<Typography variant="h4" align="center" gutterBottom>
					📊 Sales Report
				</Typography>
				<Typography variant="subtitle1" align="center" gutterBottom>
					Date Range: {startDate} → {endDate}
				</Typography>

				<Divider sx={{ my: 3 }} />

				<Paper variant="outlined">
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Customer</TableCell>
								<TableCell align="right">Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredSales.map((sale, i) => (
								<TableRow key={i}>
									<TableCell>{formatDate(sale.date)}</TableCell>
									<TableCell>{sale.customer}</TableCell>
									<TableCell align="right">
										{formatMoney(sale.amount, "₱")}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>

				<Divider sx={{ my: 3 }} />

				<Typography variant="h6" align="right">
					Total: {formatMoney(totalAmount, "₱")}
				</Typography>

				<Typography variant="body2" align="center" sx={{ mt: 4 }}>
					End of report.
				</Typography>
			</Box>
		);
	}
);

// ----------------------
// Wrapper Component
// ----------------------
type WrapperProps = PrintSalesReportProps & {
	onClose: () => void;
};

const PrintSalesReportWrapper: React.FC<WrapperProps> = ({
	filteredSales,
	startDate,
	endDate,
	onClose,
}) => {
	const printRef = useRef<HTMLDivElement | null>(null);

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: `SalesReport_${startDate}_${endDate}`,
	});

	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				bgcolor: "background.paper",
				display: "flex",
				flexDirection: "column",
				p: 3,
				boxSizing: "border-box",
				overflowY: "auto",
				zIndex: 9999,
			}}
		>
			<Box sx={{ flex: 1, overflowY: "auto" }}>
				<SalesReportPrint
					ref={printRef}
					filteredSales={filteredSales}
					startDate={startDate}
					endDate={endDate}
				/>
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					gap: 2,
					mt: 3,
				}}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={handlePrint}
					sx={{ minWidth: 120 }}
				>
					Print
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					onClick={onClose}
					sx={{ minWidth: 120 }}
				>
					Close
				</Button>
			</Box>
		</Box>
	);
};

// ----------------------
// Exports
// ----------------------
export { SalesReportPrint, PrintSalesReportWrapper };
