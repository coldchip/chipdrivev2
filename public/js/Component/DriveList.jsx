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

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setList([]);
		setLoading(true);
		setError(undefined);

		fetch("/api/v2/drive/config", {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

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
				setError(body.message);
			}
		}).finally(() => {
			setLoading(false);
		});

	}, [dispatch, token]);

	if(!error) {
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
	} else {
		return (
			<p className={cssf(css, "text mt-5")}>Error: {error}</p>
		);
	}
}

export default React.memo(DriveList);