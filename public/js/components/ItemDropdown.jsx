import React, { useRef, useState, useContext, useCallback } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import DropDown from './DropDown.jsx';
import GetLinkPopup from './GetLinkPopup.jsx';
import Prompt from './Prompt.jsx';
import Confirm from './Confirm.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function ItemDropdown(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var [renamePrompt, setRenamePrompt] = useState(false);
	var [deletePrompt, setDeletePrompt] = useState(false);
	var [getLinkPrompt, setGetLinkPrompt] = useState(false);
	var [downloadPrompt, setDownloadPrompt] = useState(false);

	var rename = useCallback((name) => {
		var taskid = 'task_' + Math.random();

		dispatch({
			type: "task", 
			id: taskid, 
			task: {
				name: `Renaming '${name}'`,
				progress: 0.0
			}
		});

		fetch(`/api/v2/drive/object/${props.item.id}`, {
			method: "PATCH",
			body: new URLSearchParams({
				name: name
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				token: token
			}
		}).then(() => {
			dispatch({
				type: "task", 
				id: taskid, 
				task: {
					name: `Renamed '${name}'`,
					progress: 100.0
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
						name: `Error renaming '${name}'`,
						progress: 100
					}
				});
			}
		});
	}, [dispatch, props.item.id, token]);

	var remove = useCallback(() => {
		var taskid = 'task_' + Math.random();

		dispatch({
			type: "task", 
			id: taskid, 
			task: {
				name: `Deleting '${props.item.name}'`,
				progress: 0.0
			}
		});

		fetch(`/api/v2/drive/object/${props.item.id}`, {
			method: "DELETE",
			headers: {
				token: token
			}
		}).then(() => {
			dispatch({
				type: "task", 
				id: taskid, 
				task: {
					name: `Deleted '${props.item.name}'`,
					progress: 100.0
				}
			});

			dispatch({
				type: "list"
			});
		}).catch((e) => {
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
						name: `Error deleting '${name}'`,
						progress: 100
					}
				});
			}
		});
	}, [dispatch, props.item.name, props.item.id, token]);

	var download = () => {
		var {item} = props;

		var link = `/api/v2/drive/object/${item.id}`;
			
		var a = document.createElement("a");
		a.style.display = "none";
		a.style.width = "0px";
		a.style.height = "0px";
		a.href = link;
		a.download = item.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	return (
		<>
			<DropDown {...props}>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					<button onClick={() => {
						setRenamePrompt(true);
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-pen-square me-2")}></i>
						Rename
					</button>

					<button onClick={() => {
						setDeletePrompt(true);
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-trash-alt me-2")}></i>
						Delete
					</button>
					
					{
						props.item.type === 1 &&
						<>
						
							<button onClick={() => {
								setGetLinkPrompt(true);
							}} className={cssf(css, "col-12 cd-option-modal-button text")}>
								<i className={cssf(css, "!fas !fa-link me-2")}></i>
								Get link
							</button>
							<button onClick={() => {
								setDownloadPrompt(true);
							}} className={cssf(css, "col-12 cd-option-modal-button text")}>
								<i className={cssf(css, "!fas !fa-arrow-circle-down me-2")}></i>
								Download
							</button>
						</>
					}
				</div>
			</DropDown>

			<Prompt 
				title="Rename this item?" 
				open={renamePrompt}
				onAccept={(name) => {
					setRenamePrompt(false);
					rename(name);
				}}
				onClose={() => {
					setRenamePrompt(false);
				}} 
			/>
			
			<Confirm 
				title="Delete this item?" 
				open={deletePrompt}
				onAccept={() => {
					setDeletePrompt(false);
					remove();
				}}
				onClose={() => {
					setDeletePrompt(false);
				}} 
			/>

			<GetLinkPopup 
				open={getLinkPrompt}
				onClose={() => {
					setGetLinkPrompt(false);
				}}
				item={props.item}
			/>

			<Confirm 
				title="Download this item?" 
				open={downloadPrompt}
				onAccept={() => {
					setDownloadPrompt(false);
					download();
				}}
				onClose={() => {
					setDownloadPrompt(false);
				}} 
			/>
		</>
	);
}

export default ItemDropdown;