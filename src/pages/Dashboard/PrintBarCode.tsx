import * as React from "react";
import Barcode from "react-barcode";

// selectedProductForBarcode[0].product.id
// selectedProductForBarcode[0].quantity

const PrintBarCode: React.FC = () => {
	return (
		<div className="print-barcode-page">
			<header>
				<h1>Barcode</h1>
				<button className="action" onClick={() => window.print()}>
					Print
				</button>
			</header>


			<div className="barcode-list">
				{/* {selectedProductForBarcode.map((selected, index) => {
					const quantity = selected.quantity;
					const product = selected.product;

					return Array.from({ length: quantity }, (_, i) => (
						<Barcode
							className="barcode-item"
							height={80}
							fontSize={16}
							value={String(product.id)}
							text={String(product.id)} />
					));
				})} */}
			</div>
		</div>
	);
};

export default PrintBarCode;
