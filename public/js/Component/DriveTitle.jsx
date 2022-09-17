import React from 'react';

import ContentLoader from 'react-content-loader'

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveTitle(props) {
	if(props.title) {
		return (
			<div className={cssf(css, "label")}>
				<p className={cssf(css, "label-text text")}>
					<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
					{props.title}
				</p>
			</div>
		);
	} else {
		return (
			<ContentLoader style={{
				display: 'block',
				width: '100%',
				height: '35px',
				margin: '20px 30px',
			}} backgroundColor="#cccccc" foregroundColor="#9d9d9d">
				<rect x="0" y="0" rx="5" ry="5" width="35" height="35" />
				<rect x="45" y="0" rx="4" ry="4" width="200" height="15" />
				<rect x="45" y="20" rx="4" ry="4" width="200" height="15" />
			</ContentLoader>
		);
	}
}

export default DriveTitle;