const getSortedFieldValues = <T,>(list: T[], field: keyof T): string[] => {
	return Array.from(
		new Set(list.map(p => p[field]).filter(Boolean) as string[])
	).sort();
};

export default getSortedFieldValues;