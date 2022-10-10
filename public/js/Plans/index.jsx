import React, { useEffect } from 'react';

import css from "./style/index.scss";
import cssf from "./../CSSFormat";

function Plans() {
	useEffect(() => {
		document.title = "ChipDrive - Plans";
	}, []);

	return (
		<h1 className={cssf(css, "text")}>Coming soon!</h1>
	);
}

export default Plans;