export type SupplierType = {
	id?: number;              // Unique ID (default start at 1001)
	shopName: string;        // Name of the supplier shop/company
	contactPerson: string;  // Person in charge (optional)
	phone: string;          // Phone number
	email: string;          // Email address
	address: string;        // Shop/company address
	archived?: boolean;      // Soft delete / inactive flag
	createdAt: number;      // Timestamp when added
	updatedAt?: number;      // Timestamp when last updated
};
