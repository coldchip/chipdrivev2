import React from 'react';
import ReactDOM from 'react-dom';

import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function Popup(props) {
	var content = (
		<div className={cssf(css, "popup-overlay")} onClick={(e) => {
			if(!props.unclosable) {
				e.preventDefault();
				if (e.target === e.currentTarget) {
					if(typeof props.onClose === 'function') {
						props.onClose();
					}
				}
			}
		}}>
			<div className={cssf(css, `popup-content ${props.fullscreen ? "popup-fullscreen" : "popup-partial"}`)}>
				{
					props.fullscreen && !props.unclosable &&
					<i className={cssf(css, "!fas !fa-times-circle cross")} onClick={(e) => {
						e.preventDefault();
			    		if (e.target === e.currentTarget) {
							if(typeof props.onClose === 'function') {
								props.onClose();
							}
						}
					}}></i>
				}
				{props.children}
			</div>
		</div>
	);

	var parent = document.getElementsByClassName(cssf(css, "chipdrive"))[0];

	return props.open && ReactDOM.createPortal(content, parent);
}

export default Popup;