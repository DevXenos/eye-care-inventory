import { LucideSearch } from "lucide-react";
import * as React from "react";
import getSortedFieldValues from "../../utils/getSortedFieldValue";
import ProductCard from "../Card/ProductCard";
import useProducts from "../../hooks/useProducts";

type ProductListType = {
	className?: string;
};

const ProductList: React.FC<ProductListType> = ({ className = "" }) => {
	const { isLoading, products } = useProducts();

	const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

	// Get categories only from non-archived products
	const categories = getSortedFieldValues(
		products.filter((p) => !p.archived),
		"category"
	);

	// Apply category + archive filtering
	const visibleProducts = products.filter((product) => {
		if (product.archived) return false;
		if (selectedCategory === "All") return true;
		return product.category === selectedCategory;
	});

	return (
		<div className={`product-list ${className}`}>
			<div className="query">
				<label>Choose Product</label>
				<div className="search">
					<LucideSearch />
					<input type="text" placeholder="Scan / Search product by code/name" />
				</div>
			</div>

			<div className="category-list">
				{["All", ...categories].map((category, index) => (
					<button
						key={index}
						className={`category ${selectedCategory === category ? "active" : ""}`}
						onClick={() => setSelectedCategory(category)}
					>
						{category}
					</button>
				))}
			</div>

			{isLoading ? (
				<p>Loading products...</p>
			) : (
				visibleProducts.map((value, index) => (
					<ProductCard key={index} product={value} onClick={() => { }} />
				))
			)}
		</div>
	);
};

export default ProductList;
