import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'sonner';
import { ConfirmDialogProvider } from './context/ConfirmDialogProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
	<React.StrictMode>
		<Toaster richColors visibleToasts={5} expand closeButton />
		<ConfirmDialogProvider>
			<App />
		</ConfirmDialogProvider>
	</React.StrictMode>
);