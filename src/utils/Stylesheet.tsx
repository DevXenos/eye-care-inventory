import { CSSProperties } from "react";

type PseudoStyles = {
	"&:hover"?: CSSProperties;
	"&:active"?: CSSProperties;
	"&:focus"?: CSSProperties;
};

type ExtendedCSSProperties = CSSProperties & PseudoStyles;

const StyleSheet = {
	create: <T extends Record<string, ExtendedCSSProperties>>(styles: T): Readonly<T> =>
		Object.freeze(styles),
};

export default StyleSheet;

const translate = (x: string|number, y: string|number): CSSProperties['transform'] => {
	return `translate(${x}, ${y})`;
}

const translateX = (x: string|number): CSSProperties['transform'] => {
	return `translateX(${x})`;
}

const translateY = (y: string|number): CSSProperties['transform'] => {
	return `translateY(${y})`;
}

export {
	translate,
	translateX,
	translateY
}