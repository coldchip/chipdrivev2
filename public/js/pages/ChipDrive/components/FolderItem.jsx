import React, { useContext, useRef, useState, useEffect } from 'react';

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { getEmptyImage } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd'

import ItemDropdown from './ItemDropdown.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function FolderItem(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [hover, setHover] = useState(false);

	const [hasMouse, setHasMouse] = useState(false);

	const optionRef = useRef(null);
	const ref = useRef(null);

	useEffect(() => {
		function checkMouse() {
			setHasMouse(matchMedia('(pointer:fine)').matches);
		}

		checkMouse();

		window.addEventListener("resize", checkMouse);

		return () => window.removeEventListener("resize", checkMouse);
	}, []);

	const [{isDragging}, drag, preview] = useDrag(() => ({
		type: "FOLDER",
		item: props.item,
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	const [{isOver}, drop] = useDrop(() => ({
		accept: ["FILE", "FOLDER"],
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop()
		}),
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
							type: "login",
							data: true
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
		<>
			<div className={cssf(css, `list-item ${isOver && 'hover'}`)} ref={ref}>
				<i ref={optionRef} style={{display: hasMouse ? "none" : "block"}} className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>

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

			<ItemDropdown
				trigger={optionRef}
				item={props.item} 
			/>

			<ItemDropdown 
				rightclick
				multi
				trigger={ref}
				item={props.item} 
			/>
		</>
	)
}

export default FolderItem;
