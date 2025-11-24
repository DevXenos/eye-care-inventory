type prefix = '₱' | '$' | '€' | '£' | '';

function formatMoney(amount: number, prefix: prefix = ''): string {
	if (isNaN(amount)) return '₱0.00';
	return `${prefix}` + Number(amount).toLocaleString('en-PH', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

export default formatMoney;
