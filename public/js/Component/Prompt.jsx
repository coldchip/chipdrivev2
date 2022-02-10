import React, { useRef, useState } from 'react';
import Popup from './Modal.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Prompt(props) {
	var modal = useRef(null);
	var [input, setInput] = useState("");

	function onReject() {
		modal.current.close();
		if(typeof props.onReject === 'function') {
			props.onReject();
		}
	}

	function onAccept() {
		modal.current.close();
		if(typeof props.onAccept === 'function') {
			props.onAccept(input);
		}
	}

	return (
		<React.Fragment>
			<Popup 
				open={props.open} 
				trigger={props.trigger}
				onOpen={props.onOpen}
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
					<div className={cssf(css, "cd-modal-body")}>
						<form className={cssf(css, "cd-modal-form")}>
							<input type="input" onChange={e => setInput(e.target.value)} className={cssf(css, "cd-modal-input text")} />
						</form>
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

export default Prompt;