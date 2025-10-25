import * as React from "react";
import Select, { SelectOption } from "./components/material/Select";

const options: SelectOption[] = [
	{
		value: "date-asc",
		label: "Date Old → New",
	},
	{
		value: "date-desc",
		label: "Date New → Old",
	},
	{
		value: "name-asc",
		label: "Name A → Z",
	},
	{
		value: "name-desc",
		label: "Name Z → A",
	},
	{
		value: "price-asc",
		label: "Price Low → High",
	},
	{
		value: "price-desc",
		label: "Price High → Low",
	},
	{
		value: "rating-desc",
		label: "Highest Rated",
	},
	{
		value: "rating-asc",
		label: "Lowest Rated",
	},
];

const TestPage: React.FC = () => {
	const [value, setValue] = React.useState<SelectOption>(options[0]);

	return (
		<div>
			<Select
				value={value}
				options={options}
				onChange={(value) => setValue(value)}
				placeholder="Sort by..."
			/>
		</div>
	);
};

export default TestPage;
