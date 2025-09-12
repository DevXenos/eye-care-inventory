import * as React from 'react';
import './Textfield.css';

type TextfieldProps = {
	tag?: 'input' | 'select';
	type?: 'text' | 'email' | 'password' | 'date' | 'number';
	className?: string;
	label: string;
	name: string;
	style?: React.CSSProperties;
	options?: { value: string; label: string }[];
	required?: boolean;
};

const Textfield: React.FC<TextfieldProps> = ({
	tag = 'input',
	type = 'text',
	className = '',
	label = '',
	name = '',
	style,
	options = [],
	required=false,
}) => {
	const id = React.useId();

	if (tag === 'input') {
		return (
			<div className={`textfield ${className}`} style={style}>
				<label htmlFor={id}>{label}</label>
				<input type={type} name={name} id={id} aria-autocomplete='none' autoComplete='off' required={required} />
			</div>
		);
	}

	if (tag === 'select') {
		return (
			<div className={`textfield ${className}`} style={style}>
				<label htmlFor={id}>{label}</label>
				<select name={name} id={id} required={required}>
					{options.map((opt, idx) => (
						<option key={idx} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>
		);
	}

	return (
		<div className={`textfield ${className}`} style={
			{
				border: "1px solid var(--text-color)",
				padding: "1rem",
				...style
			}
		}>
			<h3 style={{ textAlign: "center" }}>Tag is invalid</h3>
		</div>
	);
};

export default Textfield;
