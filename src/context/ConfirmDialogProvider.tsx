import * as React from "react";
import MaterialDialog from "../components/material/MaterialDialog"; // your dialog component
// import Button from "../components/material/Button";
import { Button } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import StyleSheet from "../utils/Stylesheet";

type ConfirmDialogOption = {
	title?: string;
	message: string;
	onClose?: () => void;      // Cancel
	onConfirm?: () => void;    // Safe action (blue)
	onDanger?: () => void;     // Dangerous action (red)
	confirmText?: string;      // Custom text for confirm button
	dangerText?: string;       // Custom text for danger button
};

type ConfirmDialogType = {
	show: (options: ConfirmDialogOption) => void;
	hide: () => void;
};

const ConfirmDialogContext = React.createContext<ConfirmDialogType | undefined>(
	undefined
);

export const useConfirmDialog = () => {
	const context = React.useContext(ConfirmDialogContext);
	if (!context) throw new Error("useConfirmDialog must be used inside ConfirmDialogProvider");
	return context;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState<ConfirmDialogOption>({
		title: "Confirm",
		message: "",
	});

	const show = (opts: ConfirmDialogOption) => {
		setOptions({ ...opts });
		setOpen(true);
	};

	const hide = () => {
		setOpen(false);
	};

	const handleCancel = () => {
		hide();
		options.onClose?.();
	};

	const handleConfirm = () => {
		hide();
		options.onConfirm?.();
	};

	const handleDanger = () => {
		hide();
		options.onDanger?.();
	};

	return (
		<ConfirmDialogContext.Provider value={{ show, hide }}>
			{children}

			<AnimatePresence>
				{open && (
					<MaterialDialog
						contentStyle={styles.content}
						closeOnClickOutside={true}
						closeOnEsc={true}
						onClose={handleCancel}
					>
						<div style={{ padding: 24, width: "100%" }}>
							{options.title && <h2>{options.title}</h2>}
							<p>{options.message}</p>

							<div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
								<Button variant="outlined" onClick={handleCancel}>
									Cancel
								</Button>

								{options.onConfirm && (
									<Button autoFocus onClick={handleConfirm}>
										{options.confirmText || "Confirm"}
									</Button>
								)}

								{options.onDanger && (
									<Button autoFocus variant="outlined" onClick={handleDanger}>
										{options.dangerText || "Danger"}
									</Button>
								)}
							</div>
						</div>
					</MaterialDialog>
				)}
			</AnimatePresence>
		</ConfirmDialogContext.Provider>
	);
};

const styles = StyleSheet.create({
	content: {
		width: "clamp(200px, 100%, 500px)",
		borderRadius: 12,
	},
});
