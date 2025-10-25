import * as React from "react";
import { ProductType } from "../../types/ProductType";
import StyleSheet from "../../utils/Stylesheet";
import Colors from "../../constants/Colors";

interface ProductCardProps {
	onClick?: (product: ProductType) => void;
	product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
	return (
		<div
			style={styles.container}
			onClick={() => {
				onClick?.(product);
			}}
		>
			{/* Category Badge */}
			<span style={styles.category}>{product.category}</span>

			{/* Product Image */}
			<div style={styles.imageWrapper}>
				<img src={product.imgSrc} alt={product.name} style={styles.image} />
			</div>

			{/* Name */}
			<p style={styles.name}>{product.name}</p>

			{/* ID bottom-right */}
			<span style={styles.id}>#{product.id}</span>
		</div>
	);
};

export default ProductCard;

const styles = StyleSheet.create({
	container: {
		userSelect: "none",
		position: "relative",
		background: Colors.card,
		borderRadius: 12,
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: 16,
		cursor: "pointer",
		transition: "transform 0.2s ease, box-shadow 0.2s ease",
		overflow: "hidden",
	},

	category: {
		position: "absolute",
		top: 8,
		left: 8,
		background: Colors.primary,
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
		padding: "2px 8px",
		borderRadius: 8,
	},

	imageWrapper: {
		flex: 1, // ensures equal reserved space across cards
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		minHeight: 100, // consistent height area for images
	},

	image: {
		maxWidth: "80%",
		maxHeight: 100,
		objectFit: "contain",
	},

	name: {
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
		marginTop: 12,
		minHeight: 24, // reserve space so all names align
	},

	id: {
		fontSize: 16,
		color: "gray",
	},
});
