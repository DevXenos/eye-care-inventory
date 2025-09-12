import { LucideArchive, LucideArchiveRestore } from "lucide-react";
import * as React from "react";

type Props = {
	archived: boolean|undefined;
}

const ArchiveButtonIcon: React.FC<Props> = ({ archived=false }) => {
	return archived ? (
		<LucideArchiveRestore />
	) : (
		<LucideArchive />
	);
}

export default ArchiveButtonIcon;