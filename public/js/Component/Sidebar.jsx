import React, { useContext } from 'react';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import NewItem from './NewItem.jsx';
import DriveList from './DriveList.jsx';
import DriveQuota from './DriveQuota.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Sidebar(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<React.Fragment>
			<div className={cssf(css, `chipdrive-sidebar ${!props.open ? `chipdrive-sidebar-hidden` : ""} pt-3`)}>
				<div className={cssf(css, "text sidebar-close")}>
					<i className={cssf(css, "!fas !fa-times cross")} onClick={() => {
						dispatch({type: "sidebar"});
					}}></i>
				</div>

				<NewItem 
					trigger={
						<button className={cssf(css, "sidebar-upload text mb-3")} tabIndex="0">
							<i className={cssf(css, "!fas !fa-plus cross me-2")} ></i>
							New
						</button>
					} 
				/>

				<DriveList />

				<div className={cssf(css, "sidebar-seperator")}></div>
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-cog me-2")}></i>
					Settings
				</button>
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-sign-out-alt me-2")}></i>
					Logout
				</button>
				
				<DriveQuota />
			</div>
			{
				props.open ? (
					<div className={cssf(css, "chipdrive-sidebar-backdrop")} onClick={() => {
						dispatch({type: "sidebar"});
					}}></div>
				) : null
			}
		</React.Fragment>
	);
}

export default Sidebar;