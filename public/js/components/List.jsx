import React, { useContext, useState, useEffect } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setList([]);
		setLoading(true);
		setError(undefined);

		fetch("/api/v2/drive/list", {
			method: "GET",
			query: {
				folderid: props.folder, 
				filter: props.filter
			},
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setList(body);
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

	}, [dispatch, props.folder, props.filter, token]);


	if(!error) {
		if(!loading) {
			if(list.length > 0) {
				return (
					<div className={cssf(css, "list-container")}>
						{
							list.map((item) => {
								return (
									<Item 
										item={item} 
										key={item.id}
									/>
								);
							})
						}
					</div>
				);
			} else {
				return (
					<div className={cssf(css, "notice-container mt-2")}>
						<p className={cssf(css, "notice-text text")}>This Folder is Empty</p>
						<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon")}></i>	
					</div>
				);
			}

		} else {
			return (
				<Loader />
			);
		}
	} else {
		return (
			<h1 className={cssf(css, "text mt-5")}>Error: {error}</h1>
		);
	}
}

export default React.memo(List);