import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface QueryContextType {
	query: string;       // live input
	debouncedQuery: string; // delayed value
	setQuery: (q: string) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const location = useLocation();

	// 🔹 Reset query every time the route (pathname) changes
	useEffect(() => {
		setQuery("");
		setDebouncedQuery("");
	}, [location.pathname]);

	// 🔹 Debounce query updates (e.g., 500ms delay)
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => {
			clearTimeout(handler); // cleanup on fast typing
		};
	}, [query]);

	return (
		<QueryContext.Provider value={{ query, debouncedQuery, setQuery }}>
			{children}
		</QueryContext.Provider>
	);
};

export const useQuery = () => {
	const context = useContext(QueryContext);
	if (!context) {
		throw new Error("useQuery must be used inside QueryProvider");
	}
	return context;
};
