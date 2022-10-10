import React, { useRef, useState, useContext, useCallback } from 'react';

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import DropDown from './DropDown.jsx';
import Prompt from './Prompt.jsx';
import Popup from './Popup.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function CreateDropdown(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var [createPrompt, setCreatePrompt] = useState(false);
	const uploadRef = useRef(null);

	var upload = useCallback(async (e) => {
		try {
			var files = e.target.files;
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
					type: "login",
					data: true
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
	}, [dispatch, props.folder, token]);

	var create = useCallback((name) => {
		var taskid = 'task_' + Math.random();

		dispatch({
			type: "task", 
			id: taskid, 
			task: {
				name: `Creating '${name}'`,
				progress: 0.0
			}
		});

		fetch("/api/v2/drive/folder", {
			method: "POST",
			body: new URLSearchParams({
				name: name,
				id: props.folder
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
					name: `Created '${name}'`,
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
						name: `Error creating '${name}'`,
						progress: 100
					}
				});
			}
		});
	}, [dispatch, props.folder, token]);

	return (
		<>
			<DropDown {...props}>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					<button onClick={() => {
						uploadRef.current.click()
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-upload me-2")}></i>
						Upload
					</button>

					<button onClick={() => {
						setCreatePrompt(true);
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-folder me-2")}></i>
						Folder
					</button>
				</div>
			</DropDown>

			<Prompt
				title="Create Folder"
				open={createPrompt}
				onAccept={(input) => {
					setCreatePrompt(false);
					create(input);
				}}
				onClose={() => {
					setCreatePrompt(false);
				}}
			/>
					
			<input type="file" className={cssf(css, "d-none")} ref={uploadRef} onChange={upload} multiple />
		</>
	);
}

export default CreateDropdown;