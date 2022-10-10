import React from 'react';

import Popup from './Popup.jsx';

import css from "./../style/index.scss";
import cssf from "./../../CSSFormat";

function PlanPopup(props) {
	return (
		<Popup {...props}>
			<div className={cssf(css, "plan-modal")}>
				<div className={cssf(css, "plans")}>
					<div className={cssf(css, "plan")}>
						
					</div>
					<div className={cssf(css, "plan")}>
						
					</div>
					<div className={cssf(css, "plan")}>
						
					</div>
				</div>
			</div>
		</Popup>
	);
}

export default PlanPopup;