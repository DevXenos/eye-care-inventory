function formatQty(amount) {
	if (isNaN(amount)) return '₱0.00';
	return Number(amount).toLocaleString('en-PH');
}

export default formatQty;
