import * as React from 'react';
import './Footer.css';

const Footer = () => {
	
	return (
		<footer className="footer">
			<p>&copy; {new Date().getFullYear()} Dela Luna Inventory Management System</p>
		</footer>
	);
}

export default Footer;