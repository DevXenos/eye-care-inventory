import * as React from 'react';

type TableProps = {
	headers: string[];
	emptyMessage?: string;
	children?: React.ReactNode;
	isLoading?: boolean;
};

const Table: React.FC<TableProps> = ({
	headers,
	emptyMessage = 'No Data',
	children,
	isLoading = false,
}) => {
	const hasContent = React.Children.count(children) > 0;
	const colSpan = headers.length > 0 ? headers.length : 1;

	return (
		<table className="table" role="presentation" cellPadding={0} cellSpacing={0} border={0}>
			<thead>
				<tr>
					{headers.map((header, index) => (
						<th key={index}>{header}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{isLoading ? (
					<tr>
						<td colSpan={colSpan} style={spanStyle}>
							Loading...
						</td>
					</tr>
				) : hasContent ? (
					children
				) : (
					<tr>
						<td colSpan={colSpan} style={spanStyle}>
							{emptyMessage}
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default Table;

const spanStyle: React.CSSProperties = {
	textAlign: 'center',
	padding: '1rem',
	fontSize: '1.2rem',
};
