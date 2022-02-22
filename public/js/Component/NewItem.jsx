import React, { useRef, useState, useContext } from 'react';

import API from './../API.js';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function NewItem(props) {
	var dispatch = useContext(ChipDriveContext);

	var dropdown = useRef(null);
	var [createPrompt, setCreatePrompt] = useState(false);
	const uploadRef = useRef(null);

	async function upload(e) {
		try {
			var files = e.target.files;
			for(var i = 0; i < files.length; i++) {
				var taskid = 'task_' + Math.random();
				
				dispatch({
					type: "task", 
					id: taskid, 
					task: {
						name: `Uploading ${files[i].name}`,
						progress: 0.0
					}
				});

				var {body} = await API.post("/api/v2/drive/file", {
					name: files[i].name,
					folderid: props.folder
				});

				await API.put(`/api/v2/drive/object/${body.id}`, files[i], (e) => { // state 2 - PUT the data
					var progress = e.toFixed(2);
					console.log(`Uploading ${progress}%`);

					dispatch({
						type: "task", 
						id: taskid, 
						task: {
							name: `Uploading ${files[i].name}`,
							progress: progress
						}
					});
				});

				dispatch({
					type: "task", 
					id: taskid, 
					task: {
						name: `Uploaded ${files[i].name}`,
						progress: 100.0
					}
				});
			}
			
			dispatch({type: "list"});
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

	function create(name) {
		var taskid = 'task_' + Math.random();

		dispatch({
			type: "task", 
			id: taskid, 
			task: {
				name: `Creating '${name}'`,
				progress: 0.0
			}
		});

		API.post("/api/v2/drive/folder", {
			name: name,
			folderid: props.folder
		}).then(() => {
			dispatch({
				type: "task", 
				id: taskid, 
				task: {
					name: `Created '${name}'`,
					progress: 100
				}
			});

			dispatch({type: "list"});
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
	}

	function renderDropdown() {
		return (
			<React.Fragment>
				<button onClick={() => {
					dropdown.current.close();
					uploadRef.current.click()
				}} className={cssf(css, "col-12 cd-option-modal-button text")}>
					<i className={cssf(css, "!fas !fa-upload me-2")}></i>
					Upload
				</button>

				<button onClick={() => {
					dropdown.current.close();
					setCreatePrompt(true);
				}} className={cssf(css, "col-12 cd-option-modal-button text")}>
					<i className={cssf(css, "!fas !fa-folder me-2")}></i>
					Folder
				</button>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<Popup 
				trigger={props.trigger}
				keepTooltipInside="body"
				closeOnDocumentClick
				ref={dropdown}
				arrow={false}
				nested
			>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					{renderDropdown()}
				</div>
			</Popup>
			<input type="file" className={cssf(css, "d-none")} ref={uploadRef} onChange={upload} multiple />

			<Prompt
				title="Create Folder"
				open={createPrompt} 
				onAccept={(input) => {
					setCreatePrompt(false);
					create(input);
				}}
				onReject={() => {
					setCreatePrompt(false);
				}}
			/>
		</React.Fragment>
	);
}

export default NewItem;