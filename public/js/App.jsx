import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './Index';
import ChipDrive from './ChipDrive';
import Login from './Login';
import Plans from './Plans';
import NotFound from './NotFound';

function App() {
	return (
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/drive" element={<ChipDrive />} />
					<Route path="/login" element={<Login />} />
					<Route path="/plans" element={<Plans />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);