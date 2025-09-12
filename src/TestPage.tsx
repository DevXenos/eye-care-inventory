import * as React from "react";
import { CSSProperties, useRef, useEffect } from "react";

type Props = {
	value?: string;
	options?: string[];
	// onSelect?: (selected: T[] => void);
};

const Dropdown: React.FC<Props> = ({ value, options }) => {
	const [showDropdown, setShowDropdown] = React.useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const itemStyle: CSSProperties = {
		minHeight: 48,
		paddingLeft: 12,
		paddingRight: 12,
		display: "flex",
		alignItems: "center",
		background: "red",
		cursor: "pointer",
	};

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			ref={dropdownRef}
			style={{
				position: "relative",
				width: 150, // fixed width for the dropdown
				userSelect: "none",
			}}
			onClick={() => setShowDropdown(!showDropdown)}
		>
			<p style={itemStyle}>{value}</p>

			{showDropdown && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						width: "100%", // match the container width
						background: "green",
						zIndex: 10,
					}}
				>
					{options?.map((option, index) => (
						<div key={index} style={itemStyle}>
							<p>{option}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const TestPage: React.FC = () => {
	return (
		<div style={{ padding: 50 }}>
			<Dropdown value={"One"} options={["One", "Two", "Three"]} />
		</div>
	);
};

export default TestPage;
