import * as React from "react";
import { ProductType } from "../../types/ProductType";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import formatMoney from "../../utils/formatMoney";

interface POSCardProps {
	product: ProductType;
	onClick?: (product: ProductType) => void;
}

const POSCard: React.FC<POSCardProps> = ({ product, onClick }) => {
	return (
		<Card
			onClick={() => onClick?.(product)}
			sx={{
				cursor: "pointer",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				p: 1.5,
				position: "relative",
				height: "100%",
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: 4,
				},
			}}
		>
			{/* Product Image */}
			<Box
				sx={{
					width: "100%",
					minHeight: 80,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					mb: 1,
				}}
			>
				<CardMedia
					component="img"
					image={product.imgSrc}
					alt={product.name}
					sx={{ maxWidth: "80%", maxHeight: 80, objectFit: "contain" }}
				/>
			</Box>

			{/* Product Name */}
			<Typography
				variant="subtitle2"
				fontWeight={600}
				textAlign="center"
				sx={{ minHeight: 20 }}
			>
				{product.name}
			</Typography>

			{/* Product Price */}
			<Typography
				variant="body1"
				fontWeight={700}
				color="primary.main"
				sx={{ mt: 0.5, userSelect: "none" }}
			>
				{formatMoney(product.sellPrice, "₱")}
			</Typography>
		</Card>
	);
};

export default POSCard;
