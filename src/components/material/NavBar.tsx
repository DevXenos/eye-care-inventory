/* eslint-disable jsx-a11y/img-redundant-alt */
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icon from 'lucide-react';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
	Avatar,
	Box,
	Button,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';

type LinkType = {
	materialIcon: React.ReactNode;
	label: string;
	links: string[];
};

const links: LinkType[] = [
	{
		materialIcon: <Icon.LayoutDashboard size={20} />,
		label: 'Dashboard',
		links: ['', '/dashboard/', '/dashboard'],
	},
	{
		materialIcon: <Icon.Receipt size={20} />,
		label: 'POS',
		links: ['pos'],
	},
	{
		materialIcon: <Icon.Box size={20} />,
		label: 'Inventory',
		links: ['inventory', 'generate-barcode', 'create-product', 'edit-product'],
	},
	{
		materialIcon: <Icon.History size={20} />,
		label: 'Stock History',
		links: ['stock-history'],
	},
	{
		materialIcon: <Icon.ShoppingBasket size={20} />,
		label: 'Purchase',
		links: ['purchase', 'create-purchase', 'edit-purchase'],
	},
	{
		materialIcon: <Icon.Truck size={20} />,
		label: 'Suppliers',
		links: ['suppliers'],
	},
	{
		materialIcon: <Icon.ShoppingBag size={20} />,
		label: 'Sales Report',
		links: ['sales-report'],
	},
];

const NavBar = () => {
	const location = useLocation();
	const currentPath = location.pathname.replace('/dashboard/', '');
	const { isLoading, currentUser } = useCurrentUser();

	return (
		<Box
			component="nav"
			sx={{
				minWidth: 250,
				maxWidth: 250,
				display: 'flex',
				flexDirection: 'column',
				boxShadow: 3,
				p: 2,
				gap: 2,
				bgcolor: 'background.paper',
				my: 2,
				ml: 2,
				borderRadius: 2,
				overflow: 'auto',
			}}
		>
			{/* Profile section */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1,
					p: 2,
				}}
			>
				<Avatar
					src={currentUser?.photoURL || '/placeholder/profile.png'}
					sx={{ width: 64, height: 64 }}
				/>
				<Typography variant="subtitle1" fontWeight={600}>
					{currentUser?.displayName || ''}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{currentUser?.email || ''}
				</Typography>
			</Box>

			<Divider />

			{/* Nav links */}
			<List sx={{ flex: 1 }}>
				{links.map((link, index) => {
					const active = link.links.includes(currentPath);
					return (
						<ListItem key={index} disablePadding>
							<ListItemButton
								component={Link}
								to={`/dashboard/${link.links[0]}`}
								selected={active}
								sx={(theme) => ({
									mb: 0.5,
									borderLeftColor: theme.palette.primary.main,
									borderLeftStyle: 'solid',
									transition: '.1s',
									borderLeftWidth: active ? 3 : 0,
								})}
							>
								<ListItemIcon sx={{ minWidth: 32 }}>
									{link.materialIcon}
								</ListItemIcon>
								<ListItemText primary={link.label} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			{/* Settings */}
			<Divider />
			<List>
				<ListItem disablePadding>
					<ListItemButton
						component={Link}
						to="/dashboard/settings"
						selected={currentPath === 'settings'}
						sx={{ borderRadius: 2 }}
					>
						<ListItemIcon sx={{ minWidth: 32 }}>
							<Icon.Settings size={20} />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
};

export default NavBar;
