import React from 'react';

import List from './List.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Body(props) {
	return (
		<div className={cssf(css, "chipdrive-body")}>
			<div className={cssf(css, "label")}>
				<p className={cssf(css, "label-text text")}>
					<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
					My Drive
				</p>
			</div>
			<List 
				folder={props.folder}
			/>
		</div>
	);
}

export default Body;