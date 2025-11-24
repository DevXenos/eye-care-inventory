import * as React from "react";
import StyleSheet from "../../utils/Stylesheet";

export type PasswordFormData = {
	currentPassword: string;
	newPassword: string;
}

type Props = {
	onSubmit: (data: PasswordFormData) => void;
	onCancel?: () => void;
}

const PasswordForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = React.useState<PasswordFormData>({
		currentPassword: '',
		newPassword: ''
	});
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [errors, setErrors] = React.useState<Partial<PasswordFormData & { confirmPassword: string }>>({});
	const [showPasswords, setShowPasswords] = React.useState({
		current: false,
		new: false,
		confirm: false
	});

	const validateForm = (): boolean => {
		const newErrors: Partial<PasswordFormData & { confirmPassword: string }> = {};

		if (!formData.currentPassword) {
			newErrors.currentPassword = 'Current password is required';
		}

		if (!formData.newPassword) {
			newErrors.newPassword = 'New password is required';
		} else if (formData.newPassword.length < 8) {
			newErrors.newPassword = 'Password must be at least 8 characters long';
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your new password';
		} else if (formData.newPassword !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
			newErrors.newPassword = 'New password must be different from current password';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const handleInputChange = (field: keyof PasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[field]: e.target.value
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: undefined
			}));
		}
	};

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);

		// Clear confirm password error when user starts typing
		if (errors.confirmPassword) {
			setErrors(prev => ({
				...prev,
				confirmPassword: undefined
			}));
		}
	};

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		setShowPasswords(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	return (
		<div style={styles.container}>
			<h2 style={styles.title}>Change Password</h2>

			<form onSubmit={handleSubmit} style={styles.form}>
				<div style={styles.fieldGroup}>
					<label htmlFor="currentPassword" style={styles.label}>
						Current Password
					</label>
					<div style={styles.inputContainer}>
						<input
							id="currentPassword"
							type={showPasswords.current ? "text" : "password"}
							value={formData.currentPassword}
							onChange={handleInputChange('currentPassword')}
							style={{
								...styles.input,
								...(errors.currentPassword ? styles.inputError : {})
							}}
							placeholder="Enter your current password"
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('current')}
							style={styles.toggleButton}
							aria-label="Toggle password visibility"
						>
							{showPasswords.current ? '👁️' : '👁️‍🗨️'}
						</button>
					</div>
					{errors.currentPassword && (
						<span style={styles.errorText}>{errors.currentPassword}</span>
					)}
				</div>

				<div style={styles.fieldGroup}>
					<label htmlFor="newPassword" style={styles.label}>
						New Password
					</label>
					<div style={styles.inputContainer}>
						<input
							id="newPassword"
							type={showPasswords.new ? "text" : "password"}
							value={formData.newPassword}
							onChange={handleInputChange('newPassword')}
							style={{
								...styles.input,
								...(errors.newPassword ? styles.inputError : {})
							}}
							placeholder="Enter your new password"
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('new')}
							style={styles.toggleButton}
							aria-label="Toggle password visibility"
						>
							{showPasswords.new ? '👁️' : '👁️‍🗨️'}
						</button>
					</div>
					{errors.newPassword && (
						<span style={styles.errorText}>{errors.newPassword}</span>
					)}
				</div>

				<div style={styles.fieldGroup}>
					<label htmlFor="confirmPassword" style={styles.label}>
						Confirm New Password
					</label>
					<div style={styles.inputContainer}>
						<input
							id="confirmPassword"
							type={showPasswords.confirm ? "text" : "password"}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							style={{
								...styles.input,
								...(errors.confirmPassword ? styles.inputError : {})
							}}
							placeholder="Confirm your new password"
						/>
						<button
							type="button"
							onClick={() => togglePasswordVisibility('confirm')}
							style={styles.toggleButton}
							aria-label="Toggle password visibility"
						>
							{showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
						</button>
					</div>
					{errors.confirmPassword && (
						<span style={styles.errorText}>{errors.confirmPassword}</span>
					)}
				</div>

				<div style={styles.buttonGroup}>
					<button
						type="submit"
						style={styles.submitButton}
					>
						Change Password
					</button>

					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							style={styles.cancelButton}
						>
							Cancel
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default PasswordForm;

const styles = StyleSheet.create({
	container: {
		padding: '24px',
		backgroundColor: '#ffffff',
		borderRadius: '8px',
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		border: '1px solid #e1e5e9'
	},

	title: {
		fontSize: '24px',
		fontWeight: '600',
		color: '#1a1a1a',
		marginBottom: '24px',
		textAlign: 'center' as const
	},

	form: {
		display: 'flex',
		flexDirection: 'column' as const,
		gap: '20px'
	},

	fieldGroup: {
		display: 'flex',
		flexDirection: 'column' as const,
		gap: '6px'
	},

	label: {
		fontSize: '14px',
		fontWeight: '500',
		color: '#374151',
		marginBottom: '4px'
	},

	inputContainer: {
		position: 'relative' as const,
		display: 'flex',
		alignItems: 'center'
	},

	input: {
		width: '100%',
		padding: '12px 40px 12px 12px',
		fontSize: '16px',
		border: '1px solid #d1d5db',
		borderRadius: '6px',
		backgroundColor: '#ffffff',
		color: '#1f2937',
		outline: 'none',
		transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
		boxSizing: 'border-box' as const,
	},

	inputError: {
		borderColor: '#ef4444',
		boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
	},

	toggleButton: {
		position: 'absolute' as const,
		right: '8px',
		top: '50%',
		transform: 'translateY(-50%)',
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		padding: '4px',
		fontSize: '16px',
		color: '#6b7280',
		borderRadius: '4px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	errorText: {
		fontSize: '12px',
		color: '#ef4444',
		marginTop: '4px'
	},

	buttonGroup: {
		display: 'flex',
		gap: '12px',
		marginTop: '8px'
	},

	submitButton: {
		flex: '1',
		padding: '12px 24px',
		fontSize: '16px',
		fontWeight: '500',
		color: '#ffffff',
		backgroundColor: '#3b82f6',
		border: 'none',
		borderRadius: '6px',
		cursor: 'pointer',
		transition: 'background-color 0.15s ease-in-out',
	},

	cancelButton: {
		flex: '1',
		padding: '12px 24px',
		fontSize: '16px',
		fontWeight: '500',
		color: '#6b7280',
		backgroundColor: '#ffffff',
		border: '1px solid #d1d5db',
		borderRadius: '6px',
		cursor: 'pointer',
		transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
	}
});