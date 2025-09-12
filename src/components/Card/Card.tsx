import * as React from 'react';
import NumberFlow from '@number-flow/react';
import StyleSheet from '../../utils/Stylesheet';

type CardContainerProps = {
	children: React.ReactNode;
};

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
	return (
		<div style={styles.cardContainer}>
			{children}
		</div>
	);
};

type CardProps = {
	materialIcon?: React.ReactNode;
	title?: string;
	value?: number | string;
};

const Card: React.FC<CardProps> = ({ materialIcon = null, title = 'Title', value = 0 }) => {
	return (
		<div style={styles.card}>
			{materialIcon && <span style={styles.icon}>{materialIcon}</span>}
			<div style={styles.content}>
				<h2 style={styles.title}>{title}</h2>
				<h1 style={styles.value}>
					<NumberFlow value={value} />
				</h1>
			</div>
		</div>
	);
};

export { CardContainer, Card };

const styles = StyleSheet.create({
	cardContainer: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
		gap: 16,
		padding: 16,
	},

	card: {
		background: '#fff',
		borderRadius: 16,
		padding: 20,
		boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
		display: 'flex',
		alignItems: 'center',
		gap: 16,
		transition: 'transform 0.2s ease, box-shadow 0.2s ease',
		cursor: 'pointer',
	},
	icon: {
		fontSize: 32,
		color: '#4f46e5', // Indigo-blue
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
	},
	title: {
		fontSize: 14,
		fontWeight: 500,
		color: '#6b7280', // Gray
		margin: 0,
	},
	value: {
		fontSize: 28,
		fontWeight: 700,
		color: '#111827', // Dark
		margin: 0,
	},
});
