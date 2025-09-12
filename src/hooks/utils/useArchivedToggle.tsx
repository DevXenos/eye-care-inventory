import { useState } from "react";

const useArchivedToggle = () => {
	const [showArchived, setShowArchived] = useState(false);

	const toggleArchived = () => setShowArchived((prev) => !prev);

	const getArchivedButtonText = () => (showArchived ? "Show Active" : "Show Archived");

	return { showArchived, toggleArchived, getArchivedButtonText };
};

export default useArchivedToggle;
