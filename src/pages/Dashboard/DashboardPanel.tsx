import { Outlet } from 'react-router-dom';
import NavBar from '../../components/UI/NavBar';
import TopBar from '../../components/UI/TopBar';
import Footer from '../../components/UI/Footer/Footer';
import React, { useState } from 'react';
import StyleSheet from '../../utils/Stylesheet';

export type DashboardPanelContext = {
	query?: string;
};

const DashboardPanel: React.FC = () => {
	const [query, setQuery] = useState<string>('');
	const [hasNotif, setHasNotif] = useState<boolean>(true); // set true to show notification initially

	return (
		<div className="dashboard-panel">
			<TopBar onQuery={setQuery} />
			<NavBar />

			<main className="dashboard-panel__main-content">
				<Outlet context={{ query }} />
			</main>

			{/* Animated Notification */}
			{/* <AnimatePresence>
				{hasNotif && (
					<motion.div
						initial={{ translateX: '-100%' }}
						animate={{ translateX: 0 }}
						exit={{ translateX: '-100%' }}
						transition={{ duration: 0.3 }}
						style={styles.notification}>
						<div ></div>
						<div style={styles.contentContainer}></div>
						<div style={styles.actionContainer}>
							<button style={styles.closeBtn}>x</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence> */}

			<Footer />
		</div>
	);
};

export default DashboardPanel;

const styles = StyleSheet.create({
	notification: {
		position: "fixed",
		width: "100svw",
		maxWidth: 400,
		background: "white",
		boxShadow: "0 0 10px gray",
		bottom: "1rem",
		left: "1rem",
		padding: 8,
		borderRadius: 12,
		display: "flex",
		alignItems: "center",
	},
	iconContainer: {},
	contentContainer: {
		flex: 1,
		backgroundColor: "red",
	},
	actionContainer: {
		height: 35,
		aspectRatio: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	closeBtn: {
		width: "100%",
		aspectRatio: 1,
		backgroundColor: "transparent",
		border: 0,
		fontSize: 18,
	}
});