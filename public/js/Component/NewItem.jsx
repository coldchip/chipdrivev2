import React, { useRef, useState, useContext, useCallback } from 'react';

import IO from './../IO.js';
import CryptoIO from './../CryptoIO.js';

import DispatchContext from './../Context/DispatchContext.jsx';
import CredentialContext from './../Context/CredentialContext.jsx';

import aesjs from 'aes-js';
import sha256 from 'js-sha256';

import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function NewItem(props) {
	var dispatch = useContext(DispatchContext);
	var key = useContext(CredentialContext);

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

				var {body} = await IO.post("/api/v2/drive/file", {
					name: file.name,
					folderid: props.folder
				});

				var cio = new CryptoIO(key);
				await cio.putFile(body.id, file);

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
			// response can be any error
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
	}, [dispatch, props.folder, key]);

	var create = (name) => {
		var taskid = 'task_' + Math.random();

		dispatch({
			type: "task", 
			id: taskid, 
			task: {
				name: `Creating '${name}'`,
				progress: 0.0
			}
		});

		IO.post("/api/v2/drive/folder", {
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
	}

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