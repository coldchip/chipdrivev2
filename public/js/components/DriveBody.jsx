import React, { useRef } from 'react';

import DriveTitle from './DriveTitle.jsx';
import BreadCrumbs from './BreadCrumbs.jsx';
import ItemList from './ItemList.jsx';
import CreateDropdown from './CreateDropdown.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveBody(props) {
	var newRef = useRef(null);
	var menuRef = useRef(null);

	return (
		<>
			<div className={cssf(css, "chipdrive-body")} ref={menuRef}>
				{
					props.root && props.folder &&
					<>
						<DriveTitle id={props.root} />

						<BreadCrumbs folder={props.folder} />

						<ItemList 
							folder={props.folder}
							filter={props.filter}
						/>

						<button ref={newRef} className={cssf(css, "upload-round p-0")}>
							<i className={cssf(css, "!fas !fa-plus")}></i>
						</button>

						<CreateDropdown 
							trigger={newRef} 
							folder={props.folder}
						/>
						
					</>
				}
			</div>

			<CreateDropdown 
				rightclick
				trigger={menuRef}
				folder={props.folder}
			/>
		</>
	);
}

export default DriveBody;