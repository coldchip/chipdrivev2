import React, { useRef } from 'react';
import Popup from './Popup.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function Alert(props) {
	var modal = useRef(null);

	var onClose = () => {
		if(typeof props.onClose === 'function') {
			props.onClose();
		}
	}

	return (
		<React.Fragment>
			<Popup open={props.open}>
				<div className={cssf(css, "cd-modal")}>
					<div className={cssf(css, "cd-modal-header")}>
						<p className={cssf(css, "cd-modal-title text")}>{props.title}</p>
					</div>
					<div className={cssf(css, "cd-modal-footer")}>
						<button className={cssf(css, "cd-modal-button text")} onClick={onAccept}>OK</button>
					</div>
				</div>
			</Popup>
		</React.Fragment>
	);
}

export default Alert;