import React, { useRef } from 'react';
import Popup from './Popup.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function Confirm(props) {
	var modal = useRef(null);

	var onClose = () => {
		if(typeof props.onClose === 'function') {
			props.onClose();
		}
	}

	var onAccept = () => {
		if(typeof props.onAccept === 'function') {
			props.onAccept();
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
						<p className={cssf(css, "error text")}>{props.error}</p>

						<div className={cssf(css, "flex-fill")}></div>

						<button className={cssf(css, "cd-modal-button text")} onClick={onClose} disabled={props.loading}>
							CANCEL
						</button>
						<button className={cssf(css, `cd-modal-button ${props.loading ? "loading" : null} text`)} onClick={onAccept} disabled={props.loading}>
							<span>OK</span>
						</button>
					</div>
				</div>
			</Popup>
		</React.Fragment>
	);
}

export default Confirm;