import * as React from 'react';
import './Button.css';
import { useNavigate } from 'react-router-dom';

type ButtonProps = {
	type?: 'submit' | 'button';
	className?: string
	classType?: '' | 'primary' | 'secondary' | 'tertiary' | 'danger' | "outline";
	style?: React.CSSProperties;
	icon?: string;
	text?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	title?: string;
	to?: string;
	replace?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	type = 'button',
	className = '',
	classType = 'primary',
	style,
	icon,
	text,
	onClick = () => { },
	title = '',
	to,
	replace=false
}) => {

	const navigate = useNavigate();

	const handleClick = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (to) {
			navigate(to, { replace });
		}

		onClick(e);
	}

	return (
		<button type={type} className={`button ${className} ${classType}`} style={style} onClick={handleClick} title={title}>
			{icon && <i className={icon}></i>}
			{text}
		</button>
	);
}

export default Button;