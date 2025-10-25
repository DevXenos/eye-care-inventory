// components/material/PrintSalesReport.tsx
import * as React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AnimationButton from "../material/AnimationButton";
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
			<div ref={ref} style={{ padding: 40, fontFamily: "monospace" }}>
				<h1 style={{ textAlign: "center", marginBottom: 20 }}>📊 Sales Report</h1>
				<p style={{ textAlign: "center", fontSize: 16 }}>
					Date Range: {startDate} → {endDate}
				</p>
				<hr style={{ margin: "20px 0" }} />

				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						fontSize: 15,
					}}
				>
					<thead>
						<tr>
							<th align="left" style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
								Date
							</th>
							<th align="left" style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
								Customer
							</th>
							<th align="right" style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredSales.map((sale, i) => (
							<tr key={i}>
								<td style={{ padding: 8 }}>{formatDate(sale.date)}</td>
								<td style={{ padding: 8 }}>{sale.customer}</td>
								<td align="right" style={{ padding: 8 }}>
									{formatMoney(sale.amount, "₱")}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<hr style={{ marginTop: 20 }} />
				<h2 style={{ textAlign: "right" }}>
					Total: {formatMoney(totalAmount, "₱")}
				</h2>
				<p style={{ textAlign: "center", marginTop: 40 }}>End of report.</p>
			</div>
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
		documentTitle: `SalesReport_${ startDate }_${ endDate } `,
	});

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "white",
				display: "flex",
				flexDirection: "column",
				padding: 24,
				boxSizing: "border-box",
				overflowY: "auto",
				zIndex: 9999,
			}}
		>
			<div style={{ flex: 1, overflowY: "auto" }}>
				<SalesReportPrint
					ref={printRef}
					filteredSales={filteredSales}
					startDate={startDate}
					endDate={endDate}
				/>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					gap: 12,
					marginTop: 24,
				}}
			>
				<AnimationButton onClick={handlePrint} style={{ flex: 0.2, minWidth: 120 }}>
					Print
				</AnimationButton>
				<AnimationButton onClick={onClose} style={{ flex: 0.2, minWidth: 120 }}>
					Close
				</AnimationButton>
			</div>
		</div>
	);
};

// ----------------------
// Exports
// ----------------------
export { SalesReportPrint, PrintSalesReportWrapper };