import * as React from 'react';
import './Receipt.css';
import Button from '../UI/Button/Button';

interface Product {
	name: string;
	qty: number;
	price: number;
	total: number;
}

interface ReceiptProps {
	products: Product[];
	onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ products, onClose }) => {
	const id = React.useId();
	const totalAmount = products.reduce((sum, item) => sum + item.total, 0);

	return (
		<div className='receipt-container'>
			<div className="receipt" id={id}>
				<div className="receipt-header">
					<h3>Transaction ID's</h3>
					<img src="your-logo.png" alt="System Logo" height={60} />
					<h2>Room Rove</h2>
					<p>Date: {new Date().toLocaleDateString()}</p>
					<p>Time: {new Date().toLocaleTimeString()}</p>
				</div>

				<div className="table-container receipt-table-container">
					<table className="receipt-table">
						<thead>
							<tr>
								<th>Item</th>
								<th>Qty</th>
								<th>Price</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product, idx) => (
								<tr key={idx}>
									<td>{product.name}</td>
									<td>{product.qty}</td>
									<td>{product.price.toFixed(2)}</td>
									<td>{product.total.toFixed(2)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="receipt-total">
								<td colSpan={3}>Total</td>
								<td>{totalAmount.toFixed(2)}</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div className="receipt-footer">
					<p>Thank you for your order!</p>
				</div>
			</div>

			<Button
				text='Print'
				onClick={onClose}
				type={'submit'}
				className={''}
				classType={'primary'}
				style={{}}
				icon={''}
				title={''}
			/>

		</div>
	);
};

export default Receipt;
