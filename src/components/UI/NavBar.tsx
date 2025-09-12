/* eslint-disable jsx-a11y/img-redundant-alt */
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icon from 'lucide-react';
import useCurrentUser from '../../hooks/useCurrentUser';

type LinkType = {
	materialIcon: React.ReactNode;
	label: string;
	links: string[];
};

const links: LinkType[] = [
	{
		materialIcon: <Icon.LayoutDashboard className='icon' />,
		label: "Dashboard",
		links: ["", "/dashboard/", "/dashboard"]
	},
	{
		materialIcon: <Icon.Receipt className='icon' />,
		label: "POS",
		links: ["pos"]
	},
	{
		materialIcon: <Icon.Box className='icon' />,
		label: "Inventory",
		links: ["inventory", "generate-barcode", "create-product", "edit-product"]
	},
	{
		materialIcon: <Icon.History className='icon' />,
		label: "Stock History",
		links: ['stock-history']
	},
	{
		materialIcon: <Icon.ShoppingBasket className='icon' />,
		label: "Purchase",
		links: ["purchase", 'create-purchase', 'edit-purchase']
	},
	{
		materialIcon: <Icon.Truck className='icon' />,
		label: "Suppliers",
		links: ['suppliers']
	},
	{
		materialIcon: <Icon.ShoppingBag className='icon' />,
		label: "Sales Report",
		links: ["sales-report"]
	},
];

const NavBar = () => {
	const location = useLocation();

	const currentPath = location.pathname.replace('/dashboard/', '');

	const { isLoading, currentUser } = useCurrentUser();

	return (
		<header className='navbar'>
			<div className="profile">
				<div className="profile-img">
					<img src="/placeholder/profile.png" alt="" />
				</div>
				<p className="name">
					{currentUser?.displayName||''}
				</p>
				<p className="email">
					{currentUser?.email||''}
				</p>
			</div>

			{links.map((link, index) => {
				const active = link.links.includes(currentPath);
				return (
					<Link
						key={index}
						className={`navbar__btn ${active ? 'active' : ''}`}
						to={`/dashboard/${link.links[0]}`}
					>
						{link.materialIcon}

						<p className='label'>
							{link.label}
						</p>
					</Link>
				);
			})}

			<div className="actions">
				<Link to='/dashboard/settings' className={'navbar__btn ' + (currentPath === 'settings' ? 'active' : '')}>
					<Icon.LucideSettings className='icon' />
					<p className="label">Settings</p>
				</Link>
			</div>

		</header>
	);
};

export default NavBar;
