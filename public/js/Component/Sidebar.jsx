import React, { useContext, useCallback } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Confirm from './Confirm.jsx';
import NewItem from './NewItem.jsx';
import DriveList from './DriveList.jsx';
import DriveQuota from './DriveQuota.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Sidebar(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var logout = useCallback((name) => {
		fetch("/api/v2/auth/logout", {
			method: "GET",
			headers: {
				token: token
			}
		}).then(() => {
			dispatch({
				type: "list"
			});
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				dispatch({
					type: "alert", 
					title: body.message
				});
			}
		});
	}, [dispatch, token]);

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

				<NewItem 
					trigger={
						<button className={cssf(css, "sidebar-upload text mb-3")} tabIndex="0">
							<i className={cssf(css, "!fas !fa-plus cross me-2")} ></i>
							New
						</button>
					}
					folder={props.folder}
				/>

				<DriveList />

				<div className={cssf(css, "sidebar-seperator")}></div>
				
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-cog me-2")}></i>
					Settings
				</button>

				<Confirm
					title="Are you sure?"
					trigger={
						<button className={cssf(css, "sidebar-item text")} onClick={logout} tabIndex="0">
							<i className={cssf(css, "!fas !fa-sign-out-alt me-2")}></i>
							Logout
						</button>
					} 
					onAccept={logout}
				/>
				
				<div className={cssf(css, "sidebar-seperator")}></div>

				<DriveQuota 
					folder={props.folder}
				/>
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

export default Sidebar;