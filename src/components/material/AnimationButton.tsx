import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Colors from "../../constants/Colors";

type Props = {
	to?: string;
	replace?: boolean;
} & React.HtmlHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button`
	position: relative;
	height: 48px;
	min-width: 150px;
	padding: 0 16px;
	border-radius: 8px;
	color: ${Colors.primary};
	cursor: pointer;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: .3s;
	border-width: 1;
	border-color: ${Colors.primary};
	border-style: solid;
	text-decoration: none;
	z-index: 0;
	overflow: hidden;

	&::before {
		position: absolute;
		content: "";
		inset: 0;
		background-color: ${Colors.primary};
		z-index: -1;
		transform: translateY(100%);
		transition: .3s;
	}

	&:hover {
		color: white;
		z-index: 1;

		&:before {
			transform: translateY(0);
		}
	}

	&:active {
		transform: scale(0.98);
	}
`;

const AnimationButton: React.FC<Props> = ({ children, to, replace = false, ...rest }) => {
	if (to) {
		return (
			<Link to={to} replace={replace} style={{textDecoration: "none"}}>
				<StyledButton {...rest}>{children}</StyledButton>
			</Link>
		);
	}
	return <StyledButton {...rest}>{children}</StyledButton>;
};

export default AnimationButton;
