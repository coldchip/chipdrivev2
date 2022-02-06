import React, { useCallback, useRef } from 'react';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Confirm(props) {
	var modal = useRef(null);

	var onReject = useCallback(() => {
		modal.current.close();
		if(typeof props.onReject === 'function') {
			props.onReject();
		}
	});

	var onAccept = useCallback(() => {
		modal.current.close();
		if(typeof props.onAccept === 'function') {
			props.onAccept();
		}
	});

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
						<button className={cssf(css, "cd-modal-button text")} onClick={onReject}>CANCEL</button>
						<button className={cssf(css, "cd-modal-button text")} onClick={onAccept}>OK</button>
					</div>
				</div>
			</Popup>
		</React.Fragment>
	);
}

export default Confirm;