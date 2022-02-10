import React from 'react';

import List from './List.jsx';
import NewItem from './NewItem.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Body(props) {
	return (
		<div className={cssf(css, "chipdrive-body")}>
			<div className={cssf(css, "label")}>
				<p className={cssf(css, "label-text text")}>
					<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
					{props.title}
				</p>
			</div>
			<List 
				folder={props.folder}
			/>
			<NewItem 
				trigger={
					<button className={cssf(css, "upload-round p-0")}>
						<i className={cssf(css, "!fas !fa-plus")}></i>
					</button>
				} 
			/>
		</div>
	);
}

export default Body;