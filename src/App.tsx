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
import Dropdown from "./TestPage";

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<AdminAuthForm />} />
				<Route path='/dashboard' element={<DashboardPanel />} >
					<Route index element={<Dashboard />} />

					<Route path='generate-barcode' element={<GenerateBarCode />} />

					<Route path='notifications' element={<Notifications />} />

					<Route path='inventory' element={<Inventory />} />
					<Route path='stock-history' element={<StockHistory />} />
					<Route path='suppliers' element={<Suppliers />} />
					<Route path="sales-report" element={<SalesReport/>} />

					<Route path="purchase" element={<Purchase />} />

					<Route path='pos' element={<POS />} />

					<Route path='settings' element={<Settings />} />
				</Route>

				<Route path="/test" element={<Dropdown/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;