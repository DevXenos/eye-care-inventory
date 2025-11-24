import * as React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import NumberFlow from '@number-flow/react';

type CardProps = {
	materialIcon?: React.ReactNode;
	title?: string;
	value?: number | string;
};

const Card: React.FC<CardProps> = ({ materialIcon = null, title = 'Title', value = 0 }) => {
	return (
		<Paper
			elevation={3}
			sx={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				gap: 2,
				padding: 2.5,
				borderRadius: 3,
				minWidth: 220,
				cursor: 'pointer',
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: 6,
				},
			}}
		>
			{materialIcon && (
				<Box sx={{ fontSize: 36, color: 'secondary.main' }}>{materialIcon}</Box>
			)}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography variant="subtitle2">
					{title}
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					<NumberFlow value={value} />
				</Typography>
			</Box>
		</Paper>
	);
};

export default Card;
