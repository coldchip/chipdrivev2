import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './pages/Index';
import ChipDrive from './pages/ChipDrive';
import NotFound from './pages/NotFound';

function App() {
	return (
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/drive" element={<ChipDrive />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);