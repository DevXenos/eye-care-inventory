import './MaterialTextfield.css';
import * as React from "react";

export type MaterialTextfieldProps = {
	className?: string;
	id?: string;
	label?: string;
	name?: string;
	value?: string; // optional
	onChange?: (value: string) => void;
	type?: 'text' | 'email' | 'password';
	style?: React.CSSProperties;
};

const MaterialTextfield: React.FC<MaterialTextfieldProps> = ({
	className = '',
	id = '',
	label = '',
	name = '',
	value,
	onChange = () => { },
	type = 'text',
	style={}
}) => {
	const [internalValue, setInternalValue] = React.useState<string>(value || '');
	const [focused, setFocused] = React.useState(false);

	// Sync internal value if the component becomes controlled
	React.useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	const isControlled = value !== undefined;
	const currentValue = isControlled ? value! : internalValue;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setInternalValue(e.target.value);
		onChange(e.target.value);
	};

	const floatLabel = focused || currentValue;

	const initialStyle: React.CSSProperties = {
		width: "100%",
		...style
	}

	return (
		<div style={initialStyle} className={`material-textfield ${className}`}>
			<input
				id={id}
				type={type}
				name={name}
				value={currentValue}
				onChange={handleChange}
				placeholder=''
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				autoComplete='off'
				aria-autocomplete='none'
			/>
			<label htmlFor={id} className={floatLabel ? 'filled' : ''}>
				{label}
			</label>
		</div>
	);
};

export default MaterialTextfield;
