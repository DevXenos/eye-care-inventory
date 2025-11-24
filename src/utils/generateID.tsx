type Options = {
	prefix?: string;
	length?: number;
	format?: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' | '0123456789' | 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
};

const isNumeric = (value: string): boolean => {
	return /^[0-9]+$/.test(value);
};

const generateID = (
	{ prefix = '', length = 8, format = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }: Options = {}
): string | number => {
	let result = prefix;

	for (let i = 0; i < length; i++) {
		result += format.charAt(Math.floor(Math.random() * format.length));
	}

	return isNumeric(result) ? Number(result) : result;
};

export default generateID;