import { CSSProperties } from "react";

type StyleInput = CSSProperties | false | null | undefined;

const combined = (...styles: StyleInput[]): CSSProperties => {
	const baseStyles: CSSProperties = {};

	styles.forEach((style) => {
		if (style) {
			Object.assign(baseStyles, style);
		}
	});

	return baseStyles;
};

export default combined;
