import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPanel from "./pages/Dashboard/DashboardPanel";
import Dashboard from "./pages/Dashboard/outlet/Dashboard";
import Inventory from "./pages/Dashboard/outlet/Inventory";
import POS from "./pages/Dashboard/outlet/POS";
import AdminAuthForm from "./components/Form/AdminAuthForm/AdminAuthForm";
import Settings from "./pages/Dashboard/outlet/Settings";
import Purchase from "./pages/Dashboard/outlet/Purchase";
import GenerateBarCode from "./pages/Dashboard/outlet/GenerateBarCode";
import StockHistory from "./pages/Dashboard/outlet/StockHistory";
import Suppliers from "./pages/Dashboard/outlet/Suppliers";
import Notifications from "./pages/Dashboard/outlet/Notifications";
import SalesReport from "./pages/Dashboard/outlet/SalesReport";
import { QueryProvider } from "./context/QueryProvider";
import useCurrentUser from "./hooks/useCurrentUser";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./constants/theme";
import CssBaseline from "@mui/material/CssBaseline";
import NoAccess from "./pages/NoAccess";
import LoadingPage from "./pages/LoadingPage";
import { User } from "firebase/auth";

type Props = {
	currentUser: User | null;
};

const Links: React.FC<Props> = ({ currentUser }) => {
	return (
		<QueryProvider>
			<Routes>
				<Route index element={<AdminAuthForm />} />
				<Route
					path="/dashboard"
					element={currentUser ? <DashboardPanel /> : <NoAccess />}
				>
					<Route index element={<Dashboard />} />
					<Route path="generate-barcode" element={<GenerateBarCode />} />

					{currentUser && (
						<>
							<Route path="notifications" element={<Notifications />} />
							<Route path="inventory" element={<Inventory />} />
							<Route path="stock-history" element={<StockHistory />} />
							<Route path="suppliers" element={<Suppliers />} />
							<Route path="sales-report" element={<SalesReport />} />
							<Route path="purchase" element={<Purchase />} />
							<Route path="pos" element={<POS />} />
							<Route path="settings" element={<Settings />} />
						</>
					)}
				</Route>
			</Routes>
		</QueryProvider>
	);
};

const App: React.FC = () => {
	const { isLoading, currentUser } = useCurrentUser();

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<BrowserRouter>
				<Links currentUser={currentUser} />
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
