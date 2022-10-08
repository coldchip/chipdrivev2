import React from 'react';

import Popup from './Popup.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function PlanPopup(props) {
	return (
		<Popup {...props}>
			<div className={cssf(css, "cd-modal")}>
				<h1 className={cssf(css, "text")}>Coming soon...</h1>
			</div>
		</Popup>
	);
}

export default PlanPopup;