import React, { useRef } from 'react';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Alert(props) {
	var modal = useRef(null);

	function onAccept() {
		modal.current.close();
		if(typeof props.onAccept === 'function') {
			props.onAccept();
		}
	}

	return (
		<React.Fragment>
			<Popup 
				open={props.open} 
				trigger={props.trigger}
				closeOnDocumentClick={false}
				closeOnEscape={false}
				ref={modal}
				nested
				modal
			>
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