import React, { useContext, useState, useEffect } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveList(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var [list, setList] = useState([]);
	var [loading, setLoading] = useState(false);

	useEffect(() => {
		setList([]);
		setLoading(true);

		fetch("/api/v2/drive/config", {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setLoading(false);
			setList(body);

			if(body.length > 0) {
				var drive = body[0];
				dispatch({
					type: "drive", name: drive.name
				});
				dispatch({
					type: "list", id: drive.id
				});
			}
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

	}, [dispatch]);

	if(!loading) {
		return (
			<div className={cssf(css, "drive-list")}>
				{
					list.map((drive) => {
						return (
							<button 
								className={cssf(css, "sidebar-item text")}
								onClick={() => {
									dispatch({
										type: "drive", 
										name: drive.name
									});
									dispatch({
										type: "list", 
										id: drive.id
									});
								}} 
								tabIndex="0"
								key={drive.id}
							>
								<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
								{drive.name}
							</button>
						);
					})
				}
			</div>
		);
	} else {
		return (
			<Loader />
		);
	}
}

export default React.memo(DriveList);