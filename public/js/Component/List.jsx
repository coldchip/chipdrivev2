import React, { useContext, useState, useEffect } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		setList([]);

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

			setLoading(false);
			setList(body);
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

	}, [dispatch, props.folder, props.filter]);

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
}

export default React.memo(List);