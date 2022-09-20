import React from 'react';

import DriveTitle from './DriveTitle.jsx';
import BreadCrumbs from './BreadCrumbs.jsx';
import List from './List.jsx';
import NewItem from './NewItem.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Body(props) {
	return (
		<div className={cssf(css, "chipdrive-body")}>
			{
				props.root && props.folder &&
				<>
					<DriveTitle id={props.root} />

					<BreadCrumbs folder={props.folder} />

					<List 
						folder={props.folder}
						filter={props.filter}
					/>

					<NewItem 
						trigger={
							<button className={cssf(css, "upload-round p-0")}>
								<i className={cssf(css, "!fas !fa-plus")}></i>
							</button>
						} 
						folder={props.folder}
					/>
				</>
			}
		</div>
	);
}

export default Body;