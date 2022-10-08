import React, { useRef, useContext } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import DriveTitle from './DriveTitle.jsx';
import BreadCrumbs from './BreadCrumbs.jsx';
import ItemList from './ItemList.jsx';
import CreateDropdown from './CreateDropdown.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveBody(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var newRef = useRef(null);
	var menuRef = useRef(null);

	const [{isOver}, drop] = useDrop(() => ({
		accept: [NativeTypes.FILE],
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop()
		}),
		drop: async ({files}) => {
			console.log(files);
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

					var {body} = await fetch("/api/v2/drive/file", {
						method: "POST",
						body: new URLSearchParams({
							name: file.name,
							id: props.folder
						}).toString(),
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							token: token
						}
					})

					await fetch(`/api/v2/drive/object/${body.id}`, {
						method: "PUT",
						body: file,
						headers: {
							token: token
						},
						progress: (e) => {
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
						}
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
						type: "task", 
						id: taskid, 
						task: {
							name: `Error uploading`,
							progress: 100
						}
					});
				}
			}
		}
	}), [dispatch, props.folder, token]);

	drop(menuRef);

	return (
		<>
			<div className={cssf(css, "chipdrive-body")} ref={menuRef}>
				{
					props.root && props.folder &&
					<>
						<DriveTitle id={props.root} />

						<BreadCrumbs folder={props.folder} />

						<ItemList 
							folder={props.folder}
							filter={props.filter}
						/>

						<button ref={newRef} className={cssf(css, "upload-round p-0")}>
							<i className={cssf(css, "!fas !fa-plus")}></i>
						</button>

						<CreateDropdown 
							trigger={newRef} 
							folder={props.folder}
						/>
						
					</>
				}
			</div>

			<CreateDropdown 
				rightclick
				trigger={menuRef}
				folder={props.folder}
			/>
		</>
	);
}

export default DriveBody;