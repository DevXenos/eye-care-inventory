import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, ReactNode, useContext, useState } from "react";
import MaterialDialog from "../components/material/MaterialDialog";
import StyleSheet from "../utils/Stylesheet";

// Generic context type
type SortDialogContextType = {
	openSortingDialog: <T extends string>(
		options: readonly T[],
		selected?: T,
		onSelect?: (options: readonly T[], selected: T) => void
	) => void;
};

// Create context
const SortDialogContext = createContext<SortDialogContextType | undefined>(undefined);

// Provider
export const SortDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<readonly string[]>([]);
	const [selectedOption, setSelectedOption] = useState<string | undefined>();
	const [callback, setCallback] = useState<((opts: readonly string[], selected: string) => void) | null>(null);

	const openSortingDialog = <T extends string>(
		opts: readonly T[],
		selected?: T,
		onSelect?: (options: readonly T[], selected: T) => void
	) => {
		setOptions(opts);
		setSelectedOption(selected as string | undefined); // store the selected option
		setCallback(() => onSelect as any || null);
		setOpen(true);
	};

	const handleSelect = (selected: string) => {
		if (callback) {
			callback(options, selected);
		}
		setSelectedOption(selected); // update selected option
		setOpen(false);
	};

	return (
		<SortDialogContext.Provider value={{ openSortingDialog }}>
			{children}

			<AnimatePresence>
				{open && (
					<MaterialDialog contentStyle={styles.container}>
						<h3>Select Sorting</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							{options.map((option) => (
								<button
									style={{
										...styles.button,
										backgroundColor: option === selectedOption ? "#e0e0e0" : "#fff", // highlight selected
										fontWeight: option === selectedOption ? "bold" : "normal",
									}}
									key={option}
									onClick={() => handleSelect(option)}
								>
									{option}
								</button>
							))}
						</div>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</SortDialogContext.Provider>
	);
};

// Custom hook
export const useSortDialog = () => {
	const context = useContext(SortDialogContext);
	if (!context) throw new Error("useSortDialog must be used within a SortDialogProvider");
	return context;
};

const styles = StyleSheet.create({
	container: {
		width: 200,
		padding: 20,
		gap: 12,
	},
	button: {
		height: 45,
		border: "1px solid #ccc",
		borderRadius: 4,
		cursor: "pointer",
	}
});
