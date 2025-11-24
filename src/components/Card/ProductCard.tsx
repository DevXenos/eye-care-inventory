import * as React from "react";
import { ProductType } from "../../types/ProductType";
import { Card, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";

interface ProductCardProps {
	onClick?: (product: ProductType) => void;
	product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
	return (
		<Card
			onClick={() => onClick?.(product)}
			sx={{
				cursor: "pointer",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				p: 2,
				position: "relative",
				height: "100%", // ensures equal height in a grid
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: 6,
				},
			}}
		>
			{/* Category Badge */}
			<Chip
				label={product.category}
				size="small"
				color="primary"
				sx={{ position: "absolute", top: 8, left: 8 }}
			/>

			{/* Product Image */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					minHeight: 100,
					mb: 2,
				}}
			>
				<CardMedia
					component="img"
					image={product.imgSrc}
					alt={product.name}
					sx={{ maxWidth: "80%", maxHeight: 100, objectFit: "contain" }}
				/>
			</Box>

			{/* Name */}
			<Typography
				variant="subtitle1"
				fontWeight={600}
				textAlign="center"
				sx={{ minHeight: 24, mb: 1, userSelect: "none" }}
			>
				{product.name}
			</Typography>

			{/* ID bottom-right */}
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ position: "absolute", bottom: 8, right: 8 }}
			>
				#{product.id}
			</Typography>
		</Card>
	);
};

export default ProductCard;
