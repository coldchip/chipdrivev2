import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChipDrive from './ChipDrive.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

function Index() {
	return (
		<div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			width: "100%",
			height: "100%"
		}}>
			<div className={cssf(css, "p-3 m-2")} style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				border: "2px solid #b1b1b1"
			}}>
				<a href="/drive" className={cssf(css, "text")} style={{
					fontSize: "25px",
					fontWeight: "500",
					textAlign: "center",
					color: "#43833a"
				}}>
					<i className={cssf(css, "!fas !fa-arrow-circle-right me-2")}></i>
					Launch ChipDrive
				</a>
				<p className={cssf(css, "text mt-3")} style={{
					fontSize: "18px",
					color: "#4d4d4d",
					fontWeight: "400",
					textAlign: "center"
				}}>
					(ChipDrive is not available to the public yet)
				</p>
			</div>
		</div>
	);
}

function App() {
	return (
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/drive" element={<ChipDrive />} />
					<Route path="*" element={<h1>404</h1>} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	);
}

ReactDOM.render(<App />, document.body);