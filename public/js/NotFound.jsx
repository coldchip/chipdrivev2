import React from 'react';

import logo from "../img/logo.png";

import css from "../css/index.scss";
import cssf from "./CSSFormat";

function NotFound() {
	return (
		<div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			width: "100%",
			height: "100%"
		}}>
			<img src={logo} alt="ChipDrive Logo" style={{
				display: "block",
				width: "400px",
			}} />

			<div style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				border: "2px solid #b1b1b1",
				width: "400px",
				margin: "28px 0",
				padding: "25px 0"
			}}>
				<h1 className={cssf(css, "text")} style={{
					fontSize: "22px",
					color: "#4D4D4D"
				}}>404 Not Found</h1>
			</div>

			<a href="/" className={cssf(css, "text")} style={{
				fontSize: "18px",
				fontWeight: "500",
				textAlign: "center",
				color: "#43833a",
			}}>
				<i className={cssf(css, "!fas !fa-arrow-circle-right me-2")}></i>
				Back to Home
			</a>
		</div>
	);
}

export default NotFound;