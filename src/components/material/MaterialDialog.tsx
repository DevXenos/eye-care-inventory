import * as React from "react";
import { motion } from "framer-motion";
import StyleSheet from "../../utils/Stylesheet";
import combined from "../../utils/combine";

// MaterialDialog.tsx
type Props<T> = {
	children?: React.ReactNode;
	overlayStyle?: React.CSSProperties;
	contentStyle?: React.CSSProperties;
	closeOnClickOutside?: boolean;
	closeOnEsc?: boolean;
	onClose?: (close: null) => void;
};

const MaterialDialog = <T,>({
	children,
	overlayStyle,
	contentStyle,
	closeOnClickOutside = false,
	closeOnEsc = false,
	onClose = () => { },
}: Props<T>) => {
	React.useEffect(() => {
		if (!closeOnEsc) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				// ✅ always close with null
				onClose?.(null);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [closeOnEsc, onClose]);

	return (
		<motion.div
			style={combined(styles.overlay, overlayStyle)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={() => {
				if (closeOnClickOutside) {
					onClose?.(null);
				}
			}}
		>
			<motion.div
				style={combined(styles.content, contentStyle)}
				initial={{ scale: 0.9, opacity: 0, y: 30 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.9, opacity: 0, y: 30 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</motion.div>
		</motion.div>
	);
};

export default MaterialDialog;

const styles = StyleSheet.create({
	overlay: {
		position: "fixed",
		inset: 0,
		display: "flex",
		zIndex: 1000,
		background: "#00000050",
		overflowY: "auto",
		padding: 40,
	},

	content: {
		margin: "auto",
		backgroundColor: "#fff",
		boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
		display: "flex",
		flexDirection: "column",
	},
});