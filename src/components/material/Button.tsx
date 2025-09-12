import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Colors from "../../constants/Colors";

const StyledBase = /*css*/`
	height: 48px;
	padding: 0 16px;
	border-radius: 8px;
	cursor: pointer;
	transition: 0.3s;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;

	&:active {
		transform: scale(0.98);
	}
`;

const StyledButton = styled.button`${StyledBase}`;
const StyledLink = styled(Link)`${StyledBase}`;

type Props = {
	variant?: "primary" | "outline" | "danger";
	to?: string;
	replace?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({
	children,
	variant = "primary",
	type = "button",
	style,
	to,
	replace,
	...rest
}) => {
	const getStyle = (variant: Props["variant"]): React.CSSProperties => {
		switch (variant) {
			case "outline":
				return {
					borderWidth: 2,
					borderColor: Colors.primary,
					borderStyle: "solid",
					color: Colors.primary,
					background: "transparent",
				};
			case "danger":
				return {
					background: Colors.danger ?? "#ff4d4f",
					color: "white",
					border: "none",
				};
			default:
				return {
					background: Colors.primary,
					color: "white",
					border: "none",
				};
		}
	};

	const baseStyles: React.CSSProperties = {
		...getStyle(variant),
		...style,
	};

	// If `to` is provided, render Link instead of button
	if (to) {
		return (
			<StyledLink to={to} replace={replace} style={baseStyles} {...(rest as any)}>
				{children}
			</StyledLink>
		);
	}

	return (
		<StyledButton style={baseStyles} type={type} {...rest}>
			{children}
		</StyledButton>
	);
};

export default Button;
