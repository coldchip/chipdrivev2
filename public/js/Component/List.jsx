import React, { useContext, useState, useEffect } from 'react';

import IO from './../IO.js';

import DispatchContext from './../Context/DispatchContext.jsx';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var dispatch = useContext(DispatchContext);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		setList([]);

		IO.get("/api/v2/drive/list", {
			folderid: props.folder, 
			filter: props.filter
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

	var onDrop = async (e) => {
		e.stopPropagation();
		e.preventDefault();

		if(e.dataTransfer.items) {
			var files = [];

			for(const item of e.dataTransfer.items) {
				if(item.kind === "file") {
					files.push(item.getAsFile());
				}
			}

			try {
				for(const file of files) {
					var taskid = 'task_' + Math.random();
			
					dispatch({
						type: "task", 
						id: taskid, 
						task: {
							name: `Uploading ${file.name}`,
							progress: 0.0
						}
					});

					var {body} = await IO.post("/api/v2/drive/file", {
						name: file.name,
						folderid: props.folder
					});

					await IO.put(`/api/v2/drive/object/${body.id}`, file, (e) => {
						var progress = e.toFixed(2);
						console.log(`Uploading ${progress}%`);

						dispatch({
							type: "task", 
							id: taskid, 
							task: {
								name: `Uploading ${file.name}`,
								progress: progress
							}
						});
					});

					dispatch({
						type: "task", 
						id: taskid, 
						task: {
							name: `Uploaded ${file.name}`,
							progress: 100.0
						}
					});
				}

				dispatch({
					type: "list"
				});
			} catch(response) {
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
			}
		}

		console.log(e);
	}

	var onDragover = (e) => {
		e.stopPropagation();
		e.preventDefault();

		console.log(e);
	}

	if(!loading) {
		if(list.length > 0) {
			return (
				<div onDrop={onDrop} onDragOver={onDragover} className={cssf(css, "list-container")}>
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