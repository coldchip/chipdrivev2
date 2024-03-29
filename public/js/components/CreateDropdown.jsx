import React, { useRef, useState, useContext, useCallback } from 'react';

import fetch from './../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import DropDown from './DropDown.jsx';
import Prompt from './Prompt.jsx';
import Popup from './Popup.jsx';
import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function CreateDropdown(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var [createPrompt, setCreatePrompt] = useState(false);
	var [createPromptLoading, setCreatePromptLoading] = useState(false);
	var [createPromptError, setCreatePromptError] = useState("");

	var [hostingPrompt, setHostingPrompt] = useState(false);
	var [hostingPromptLoading, setHostingPromptLoading] = useState(false);
	var [hostingPromptError, setHostingPromptError] = useState("");

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
			}
			
			dispatch({
				type: "task", 
				id: taskid, 
				task: {
					name: `Error uploading`,
					progress: 100
				}
			});
		}
	}, [dispatch, props.folder, token]);

	var create = useCallback((name) => {
		setCreatePromptLoading(true);
		setCreatePromptError(undefined);

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
			setCreatePrompt(false);

			dispatch({
				type: "list"
			});
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				setCreatePrompt(false);
				dispatch({
					type: "login",
					data: true
				});
			} else {
				setCreatePromptError(body.message);
			}
		}).finally(() => {
			setCreatePromptLoading(false);
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
						setCreatePromptLoading(false);
						setCreatePromptError("");
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-folder me-2")}></i>
						Folder
					</button>

					<button onClick={() => {
						setHostingPrompt(true);
						setHostingPromptLoading(false);
						setHostingPromptError("");
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-server me-2")}></i>
						Static Hosting
					</button>
				</div>
			</DropDown>

			<Prompt
				title="Create Folder"
				open={createPrompt}
				loading={createPromptLoading}
				error={createPromptError}
				onAccept={(input) => {
					create(input);
				}}
				onClose={() => {
					setCreatePrompt(false);
				}}
			/>

			<Prompt
				title="Create Static Hosting"
				open={hostingPrompt}
				loading={hostingPromptLoading}
				error={hostingPromptError}
				onAccept={(input) => {
					alert("Coming soon!");
				}}
				onClose={() => {
					setHostingPrompt(false);
				}}
			/>
					
			<input type="file" className={cssf(css, "d-none")} ref={uploadRef} onChange={upload} multiple />
		</>
	);
}

export default CreateDropdown;