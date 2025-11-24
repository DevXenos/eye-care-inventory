// BarcodeCard.tsx
import * as React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

type BarcodeCardProps = {
	code: any;
	name: any;
	onClick?: () => void;
};

const BarcodeCard: React.FC<BarcodeCardProps> = ({ code, name, onClick }) => {
	return (
		<Card
			sx={{
				minWidth: 200,
				maxWidth: 250,
				p: 1,
				cursor: onClick ? "pointer" : "default",
				textAlign: "center",
				boxShadow: 3,
			}}
			onClick={onClick}
		>
			<CardContent>
				<Typography sx={{ userSelect: "none" }} variant="subtitle2" color="text.secondary">
					{code}
				</Typography>
				<Typography sx={{userSelect: "none"}} variant="h6">{name}</Typography>
			</CardContent>
		</Card>
	);
};

export default BarcodeCard;
