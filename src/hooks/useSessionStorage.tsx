import { useState } from 'react';

function useSessionStorage<T>(key: string, initialValue: T) {
	const getStoredValue = (): T => {
		const stored = sessionStorage.getItem(key);
		if (stored !== null) {
			try {
				return JSON.parse(stored);
			} catch {
				return initialValue;
			}
		}
		return initialValue;
	};

	const [value, setValue] = useState<T>(getStoredValue);

	const setSessionStorage = (newValue: T) => {
		setValue(newValue);
		sessionStorage.setItem(key, JSON.stringify(newValue));
	};

	return [value, setSessionStorage] as const;
}

export default useSessionStorage;