import './index.min.css';
import '@jtech-works/bottom-sheet/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'sonner';
import DialogContextProvider from '@jtech-works/dialog';
import { ConfirmDialogProvider } from './context/ConfirmDialogProvider';
import { SortDialogProvider } from './context/SortDialogProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
	<React.StrictMode>
		<Toaster richColors visibleToasts={5} expand closeButton />
		<DialogContextProvider animation='opacity' >
			<ConfirmDialogProvider>
				<SortDialogProvider>
					<App />
				</SortDialogProvider>
			</ConfirmDialogProvider>
		</DialogContextProvider>
	</React.StrictMode>
);