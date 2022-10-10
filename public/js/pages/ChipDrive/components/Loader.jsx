import React from 'react';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function Loader() {
	return (
		<div className={cssf(css, "spinner-container p-4")}>
			<div className={cssf(css, "spinner")}></div>
		</div>
	);
}

export default Loader;