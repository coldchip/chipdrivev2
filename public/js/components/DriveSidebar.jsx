import React, { useContext, useRef } from 'react';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Confirm from './Confirm.jsx';
import CreateDropdown from './CreateDropdown.jsx';
import DriveList from './DriveList.jsx';
import DriveQuota from './DriveQuota.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveSidebar(props) {
	var dispatch = useContext(ChipDriveContext);

	var menuRef = useRef(null);

	return (
		<React.Fragment>
			<div className={cssf(css, `chipdrive-sidebar ${!props.open ? `chipdrive-sidebar-hidden` : ""} pt-3`)}>
				<div className={cssf(css, "text sidebar-close")}>
					<i className={cssf(css, "!fas !fa-times cross")} onClick={() => {
						dispatch({
							type: "sidebar"
						});
					}}></i>
				</div>

				<button className={cssf(css, "sidebar-upload text mb-3")} tabIndex="0" ref={menuRef}>
					<i className={cssf(css, "!fas !fa-plus cross me-2")} ></i>
					New
				</button>

				<CreateDropdown 
					trigger={menuRef}
					folder={props.folder}
				/>

				<DriveList />

				<div className={cssf(css, "sidebar-seperator")}></div>
				
				<DriveQuota 
					folder={props.folder}
				/>

				<div className={cssf(css, "sidebar-seperator")}></div>
			</div>
			{
				props.open ? (
					<div className={cssf(css, "chipdrive-sidebar-backdrop")} onClick={() => {
						dispatch({
							type: "sidebar"
						});
					}}></div>
				) : null
			}
		</React.Fragment>
	);
}

export default DriveSidebar;