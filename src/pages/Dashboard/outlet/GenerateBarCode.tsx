import { LucideList, LucidePrinter } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import ProductList from "../../../components/UI/ProductList";
import Table from "../../../components/UI/Table/Table";
import QTYInput from "../../../components/UI/QTYInput";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";

const GenerateBarCode: React.FC = () => {

	const contentRef = React.useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({ contentRef });

	return (
		<div className="outlet generate-barcode-page">
			<div className="table-actions">
				<Link className="action" to='../inventory'>
					<LucideList />
					Product List
				</Link>
			</div>

			<ProductList className="barcode-product-list" />

			<div className="generate-barcode-content">
				<div className="table-container">
					<h2 className='title'>Selected Product</h2>
					<Table headers={['Name', 'Code', 'Quantity']}>
						
					</Table>
				</div>

				<div className="table-actions">
					<button className="action print-button" onClick={reactToPrintFn}>
						<LucidePrinter />Print Barcode
					</button>
				</div>
			</div>

			<div className="barcode-list" ref={contentRef}>
				{/* {selectedProductForBarcode.map((selected, index) => {
					const quantity = selected.quantity;
					const product = selected.product;

					return Array.from({ length: quantity }, (_, i) => (
						<div className="barcode">
							<Barcode
								key={`${product.id}-${i}`}
								width={1}
								height={50}
								value={String(product.id)}
								text={String(product.id)}
							/>
						</div>
					));
				})} */}
			</div>
		</div>
	);
}

export default GenerateBarCode;