import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { ChevronDown, Check } from "lucide-react";
import StyleSheet from "../../utils/Stylesheet";
import Colors from "../../constants/Colors";

export interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	options?: SelectOption[];
	value?: SelectOption;
	onChange?: (value: SelectOption) => void; // always returns a SelectOption
	placeholder?: string;
	isSearchable?: boolean;
	disabled?: boolean;
	error?: boolean;
	style?: CSSProperties;
	width?: string | number;
}

const styles = StyleSheet.create({
	container: { position: "relative", display: "inline-block" },
	selectButton: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		border: `2px solid ${Colors.primary}`,
		borderRadius: "8px",
		cursor: "pointer",
		minHeight: "48px",
	},
	selectButtonDisabled: {
		backgroundColor: "#f3f4f6",
		borderColor: "#e5e7eb",
		color: "#9ca3af",
		cursor: "not-allowed",
	},
	selectButtonError: { borderColor: "#ef4444" },
	valueContainer: {
		flex: 1,
		display: "flex",
		alignItems: "center",
		gap: "8px",
		minHeight: "20px",
	},
	placeholder: { color: "#6b7280" },
	selectedValue: { color: "#111827" },
	chevron: { color: "#6b7280", transition: "transform 0.2s" },
	chevronRotated: { transform: "rotate(180deg)" },
	dropdown: {
		position: "absolute",
		top: "100%",
		left: 0,
		width: "100%",
		marginTop: "4px",
		backgroundColor: "#ffffff",
		border: "1px solid #e5e7eb",
		borderRadius: "8px",
		boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
		maxHeight: "500px",
		overflow: "hidden",
		zIndex: 50,
	},
	searchContainer: { padding: "8px", borderBottom: "1px solid #f3f4f6" },
	searchInput: {
		width: "100%",
		padding: "8px 12px",
		fontSize: "14px",
		border: "1px solid #e5e7eb",
		borderRadius: "4px",
		outline: "none",
	},
	optionsList: { overflowY: "auto" },
	option: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		textAlign: "left",
		fontSize: "14px",
		color: "#374151",
		cursor: "pointer",
		backgroundColor: "transparent",
		border: "none",
	},
	optionSelected: { backgroundColor: "#eff6ff", color: "#1d4ed8" },
	noOptions: { padding: "12px 16px", color: "#6b7280", fontSize: "14px" },
	checkIcon: { color: "#2563eb" },
});

const Select: React.FC<SelectProps> = ({
	options = [],
	value,
	onChange = () => { },
	placeholder = "Select an option...",
	isSearchable = false,
	disabled = false,
	error = false,
	style = {},
	width,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const selectRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Default to first option if value is undefined
	const selected = value ?? options[0];

	useEffect(() => {
		if (!value && options.length > 0) {
			onChange(options[0]);
		}
	}, [options, value, onChange]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setSearchTerm("");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (isOpen && isSearchable && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isOpen, isSearchable]);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const toggleOpen = () => {
		if (!disabled) {
			setIsOpen((prev) => !prev);
			if (!isOpen) setSearchTerm("");
		}
	};

	const handleOptionClick = (option: SelectOption) => {
		onChange(option);
		setIsOpen(false);
		setSearchTerm("");
	};

	const isSelected = (option: SelectOption) => selected?.value === option.value;

	const getButtonStyle = (): CSSProperties => ({
		...styles.selectButton,
		...(disabled ? styles.selectButtonDisabled : {}),
		...(error ? styles.selectButtonError : {}),
		...style,
	});

	return (
		<div
			ref={selectRef}
			style={{
				...styles.container,
				minWidth: 150,
				width: width ?? style?.width,
			}}
		>
			<button
				type="button"
				onClick={toggleOpen}
				disabled={disabled}
				style={getButtonStyle()}
			>
				<div style={styles.valueContainer}>
					<span style={!selected ? styles.placeholder : styles.selectedValue}>
						{selected ? selected.label : placeholder}
					</span>
				</div>
				<ChevronDown
					size={20}
					style={{
						...styles.chevron,
						...(isOpen ? styles.chevronRotated : {}),
					}}
				/>
			</button>

			{isOpen && (
				<div style={styles.dropdown}>
					{isSearchable && (
						<div style={styles.searchContainer}>
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Search options..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								style={styles.searchInput}
							/>
						</div>
					)}
					<div style={styles.optionsList}>
						{filteredOptions.length === 0 ? (
							<div style={styles.noOptions}>
								{searchTerm ? "No options found" : "No options available"}
							</div>
						) : (
							filteredOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleOptionClick(option)}
									style={{
										...styles.option,
										...(isSelected(option) ? styles.optionSelected : {}),
									}}
								>
									<span>{option.label}</span>
									{isSelected(option) && <Check size={16} style={styles.checkIcon} />}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

// export default Select;