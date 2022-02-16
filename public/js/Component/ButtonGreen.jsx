import React from 'react';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function ButtonGreen(props) {
	return (
		<button className={cssf(css, "button button-green text") + " " + props.className} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

export default ButtonGreen;