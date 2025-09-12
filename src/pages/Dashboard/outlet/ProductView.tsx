import * as React from "react";
import { LucideX } from "lucide-react";
import { ProductType } from "../../../types/ProductType";
import formatQty from "../../../utils/formatQty";

const ProductView: React.FC<{ product: ProductType; onClose: () => void }> = ({
	product,
	onClose,
}) => {
	return (
		<div className="view-dialog">
			<div className="table-actions">
				<h1 style={{marginRight: "auto"}}>
					Product Details
				</h1>

				<button className="action" onClick={onClose}>
					<LucideX />
				</button>
			</div>

			<div className="dialog-body">
				<div className="image-section">
					<img
						src={product.imgSrc || "/placeholder/product.jpeg"}
						alt={product.name}
					/>
				</div>

				<div className="info-section">
					<div className="span">
						<h2>{product.id}</h2>
					</div>

					<div>Category</div>
					<div>{product.category}</div>

					<div>Type:</div>
					<div>{product.type}</div>

					<div>Brand:</div>
					<div>{product.brand}</div>

					<div>Stock:</div>
					<div>{formatQty(product.stock)}</div>

					<div>Expiry:</div>
					<div>{product.expiry}</div>

					<div>Cost Price:</div>
					<div>${product.costPrice}</div>

					<div>Sell Price:</div>
					<div>${product.sellPrice}</div>
				</div>
			</div>
		</div>
	);
};

export default ProductView;
