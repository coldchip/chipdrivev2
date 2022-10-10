import React from 'react';

import css from "./style/index.scss";
import cssf from "./../CSSFormat";

function Index() {
	return (
		<a className={cssf(css, "text")} href="/drive">Go to ChipDrive</a>
	);
}

export default Index;