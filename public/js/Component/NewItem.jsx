import React, { useRef, useState, useContext, useCallback } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function NewItem(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var dropdown = useRef(null);
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
						folderid: props.folder
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
					type: "alert", 
					title: body.message
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
				folderid: props.folder
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
					type: "login"
				});
			} else {
				dispatch({
					type: "alert", 
					title: body.message
				});
			}
		});
	}, [dispatch, props.folder, token])

	var dropdownInner = (
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
					{dropdownInner}
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