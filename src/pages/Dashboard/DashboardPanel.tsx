import { Outlet } from 'react-router-dom';
import NavBar from '../../components/material/NavBar';
import TopBar from '../../components/material/TopBar';
// import Footer from '../../components/UI/Footer/Footer';
import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type DashboardPanelContext = {
	query?: string;
};

const DashboardPanel: React.FC = () => {
	const [query, setQuery] = useState<string>('');

	return (
		<Box sx={{ display: "flex", height: "100svh" }}>
			{/* Left navigation */}
			<NavBar />

			{/* Main content */}
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
				<TopBar onQuery={setQuery} />
				<Box sx={{ flex: 1, overflow: "auto", p: 2, }}>
					<Outlet context={{ query }} />
				</Box>
				{/* <Footer /> */}
			</Box>
		</Box>
	);
};

export default DashboardPanel;

/* Example notification (MUI replacement for old styles) */
export const Notification: React.FC<{
	message: string;
	onClose?: () => void;
}> = ({ message, onClose }) => {
	return (
		<Paper
			sx={{
				position: "fixed",
				width: "100svw",
				maxWidth: 400,
				boxShadow: 3,
				bottom: "1rem",
				left: "1rem",
				p: 2,
				borderRadius: 2,
				display: "flex",
				alignItems: "center",
				gap: 1,
			}}
		>
			{/* Icon container */}
			<Box sx={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
				🔔
			</Box>

			{/* Content */}
			<Typography variant="body2" sx={{ flex: 1 }}>
				{message}
			</Typography>

			{/* Close button */}
			<IconButton size="small" onClick={onClose}>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Paper>
	);
};
