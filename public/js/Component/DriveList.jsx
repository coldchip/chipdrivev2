import React, { useContext, useState, useEffect } from 'react';

import IO from './../IO.js';

import DispatchContext from './../Context/DispatchContext.jsx';

import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveList(props) {
	var dispatch = useContext(DispatchContext);

	var [list, setList] = useState([]);
	var [loading, setLoading] = useState(false);

	useEffect(() => {
		setList([]);
		setLoading(true);

		IO.get("/api/v2/drive/config", null).then((response) => {
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