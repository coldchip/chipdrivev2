import React from 'react';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

import spinner from "../../img/loader.svg";

function Loader() {
	return (
		<React.Fragment>
			<div className={cssf(css, "spinner-container p-4")}>
				<img src={spinner} className={cssf(css, "spinner")}/>
			</div>
		</React.Fragment>
	);
}

export default Loader;