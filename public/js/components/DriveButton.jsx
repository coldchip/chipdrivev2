import React, { useContext } from 'react';

import fetch from './../fetch.js';

import { useDrop } from 'react-dnd'

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function DriveButton(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [{isOver}, drop] = useDrop(() => ({
		accept: ["FILE", "FOLDER"],
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop()
		}),
		drop: (src) => {
			if(src.id !== props.id) {
				var taskid = 'task_' + Math.random();

				dispatch({
					type: "task", 
					id: taskid, 
					task: {
						name: `Moving '${src.name}'`,
						progress: 0.0
					}
				});

				fetch(`/api/v2/drive/cut`, {
					method: "POST",
					body: new URLSearchParams({
						src: src.id,
						dst: props.id
					}).toString(),
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						token: token
					}
				}).then((response) => {
					console.log(response);
					var {status, body} = response;

					dispatch({
						type: "task", 
						id: taskid, 
						task: {
							name: `Moved '${src.name}'`,
							progress: 100
						}
					});

					dispatch({
						type: "list"
					});
				}).catch((response) => {
					var {status, body} = response;

					if(status === 401) {
						dispatch({
							type: "login",
							data: true
						});
					}

					dispatch({
						type: "task", 
						id: taskid, 
						task: {
							name: `Error Moving '${src.name}'`,
							progress: 100
						}
					});
				});
			}
		}
	}));

	return (
		<button 
			ref={drop}
			className={cssf(css, `sidebar-item text ${isOver && 'hover'}`)}
			onClick={() => {
				dispatch({
					type: "drive", 
					id: props.id
				});
				dispatch({
					type: "list", 
					id: props.id
				});
			}} 
			tabIndex="0"
			key={props.id}
		>
			<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
			{props.name}
		</button>
	);
}

export default DriveButton;