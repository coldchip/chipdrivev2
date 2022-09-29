import React, { useContext, useRef } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { useDrag, useDrop } from 'react-dnd'

import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Folder(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const ref = useRef(null);

	const [{isDragging}, drag] = useDrag(() => ({
		type: "FOLDER",
		item: props.item,
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const [, drop] = useDrop(() => ({
		accept: ["FILE", "FOLDER"],
		drop: (src) => {
			if(src.id !== props.item.id) {
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
						dst: props.item.id
					}).toString(),
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						token: token
					}
				}).then((response) => {
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
							type: "login"
						});
					} else {
						dispatch({
							type: "task", 
							id: taskid, 
							task: {
								name: `Error Moving '${src.name}'`,
								progress: 100
							}
						});
					}
				}).finally(() => {
					
				});
			}
		}
	}));

	drag(drop(ref));

	return (
		<div className={cssf(css, "list-item")} style={{visibility: isDragging ? "hidden" : "visible"}} ref={ref}>
			<ItemOption 
				trigger={
					<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
				} 
				item={props.item} 
			/>

			<div className={cssf(css, "list-item-inner")} onClick={() => {
				var {item} = props;

				dispatch({
					type: "list", 
					id: item.id
				});
			}}>
				<i className={cssf(css, "!fas !fa-folder item-icon")}></i>
				<p className={cssf(css, "item-label text")}>{props.item.name}</p>
			</div>
		</div>
	)
}

export default Folder;