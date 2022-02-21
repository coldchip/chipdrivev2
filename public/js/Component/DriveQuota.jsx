import React from 'react';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveQuota() {
	return (
		<React.Fragment>
			<div className={cssf(css, "sidebar-seperator")}></div>
			<div className={cssf(css, "sidebar-quota pt-3 pb-3")} tabIndex="0">
				<div className={cssf(css, "quota-header text")}>
					<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
					My Storage
				</div>
				<div className={cssf(css, "quota-bar mt-3")}>
					<div className={cssf(css, "quota-bar-used")}></div>
				</div>
				<div className={cssf(css, "quota-usage text mt-2")}>
					0.0 B of 0 B used
				</div>
				<div className={cssf(css, "quota-warning text mt-2")}>
					<i className={cssf(css, "!fas !fa-info-circle me-2")}></i>
					Quota almost full
				</div>
			</div>
			<div className={cssf(css, "sidebar-seperator")}></div>
		</React.Fragment>
	);
}

export default DriveQuota;