import React from 'react';

import Popup from './Popup.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function GetLink(props) {
	let link = `${window.location.protocol}//${window.location.host}/api/v2/drive/object/${props.item.id}`;
	var body = (
		<div className={cssf(css, "getlink")}>
			<h1 className={cssf(css, "getlink-title text")}>Public Link for '{props.item.name}'</h1>
			<input 
				type="text" 
				className={cssf(css, "getlink-input text")}
				value={link}
				readonly
			/>
		</div>
	);

	return (
		<Popup 
			open={props.open} 
			onClose={props.onClose}
			keepTooltipInside="body"
			modal
			nested
		>
			{body}
		</Popup>
	);
}

export default GetLink;