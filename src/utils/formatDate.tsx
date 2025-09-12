const formatDate = (date: number = Date.now()): string => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
	return new Date(date).toLocaleDateString(undefined, options);
}

export default formatDate;