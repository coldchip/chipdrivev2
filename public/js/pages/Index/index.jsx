import React from 'react';

import { useNavigate } from 'react-router-dom';

import css from "./style/index.scss";
import cssf from "./../../CSSFormat";

function Index() {
	const navigate = useNavigate();

	return (
		<button className={cssf(css, "text")} onClick={() => navigate("/drive")}>Go to ChipDrive</button>
	);
}

export default Index;