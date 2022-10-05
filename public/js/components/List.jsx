import React, { useContext, useState, useEffect, useRef } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Loader from './Loader.jsx';
import NewItem from './NewItem.jsx';
import File from './File.jsx';
import Folder from './Folder.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var menuRef = useRef(null);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setList([]);
		setLoading(true);
		setError(undefined);

		fetch(`/api/v2/drive/list/${props.folder}`, {
			method: "GET",
			query: {
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
					<DndProvider backend={HTML5Backend}>
						<div className={cssf(css, "list-container")} ref={menuRef}>
							{
								list.map((item) => {
									if(item.type === 1) {
										return (
											<File 
												item={item} 
												key={item.id}
											/>
										);
									} else {
										return (
											<Folder 
												item={item} 
												key={item.id}
											/>
										);
									}
								})
							}
						</div>

						<NewItem 
							rightclick
							trigger={menuRef} 
							folder={props.folder}
						/>
					</DndProvider>
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