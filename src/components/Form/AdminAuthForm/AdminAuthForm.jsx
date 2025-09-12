import * as React from 'react';
import StyleSheet from '../../../utils/Stylesheet';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebaseConfig';
import Colors from '../../../constants/Colors';

const styles = StyleSheet.create({
	adminAuth: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		backgroundColor: '#f5f7fa',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		width: '400px',
		backgroundColor: '#fff',
		padding: '50px 35px',
		borderRadius: '20px',
		boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
	},
	title: {
		fontSize: '32px',
		fontWeight: 700,
		color: Colors.primary,
		marginBottom: '40px',
		textAlign: 'center',
		fontFamily: 'Inter, sans-serif',
	},
	inputGroup: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '25px',
	},
	label: {
		fontSize: '14px',
		fontWeight: 600,
		color: '#555',
		marginBottom: '8px',
	},
	input: {
		height: '50px',
		padding: '0 15px',
		fontSize: '16px',
		borderRadius: '12px',
		border: '1px solid #ddd',
		backgroundColor: '#fafafa',
		outline: 'none',
	},
	button: {
		marginTop: '20px',
		padding: '16px 0',
		backgroundColor: Colors.primary,
		color: '#fff',
		fontSize: '18px',
		fontWeight: 600,
		border: 'none',
		borderRadius: '14px',
		cursor: 'pointer',
	},
});

const AdminAuthForm = () => {
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		// Set default value for test purposes
		const email = e.target.email.value || "alpha@gmail.com";
		const password = e.target.password.value || "Password";

		signInWithEmailAndPassword(auth, email, password)
			.catch(() => {
				createUserWithEmailAndPassword(auth, email, password);
			})
			.finally(() => {
				navigate('/dashboard');
			});
	}

	return (
		<div style={styles.adminAuth}>
			<form style={styles.form} onSubmit={handleSubmit}>
				<h1 style={styles.title}>Admin Log in</h1>

				<div style={styles.inputGroup}>
					<label htmlFor="email" style={styles.label}>Email</label>
					<input
						id="email"
						name="email"
						type="email"
						style={styles.input}
						// required
					/>
				</div>

				<div style={styles.inputGroup}>
					<label htmlFor="password" style={styles.label}>Password</label>
					<input
						id="password"
						name="password"
						type="password"
						style={styles.input}
						// required
					/>
				</div>

				<button type="submit" style={styles.button}>Log In</button>
			</form>
		</div>
	);
}

export default AdminAuthForm;
