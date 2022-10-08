import React from 'react';
import ReactDOM from 'react-dom';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Popup(props) {
	var content = (
		<div className={cssf(css, "popup-overlay")} onClick={(e) => {
			if(e.target.className === cssf(css, "popup-overlay")) {
				if(typeof props.onClose === 'function') {
					props.onClose();
				}
			}
		}}>
			<div className={cssf(css, "popup-content")}>
				{props.children}
			</div>
		</div>
	);

	var parent = document.getElementsByClassName(cssf(css, "chipdrive"))[0];

	return props.open && ReactDOM.createPortal(content, parent);
}

export default Popup;