import React, { useRef, useState, useContext } from 'react';

import IO from './../IO.js';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import aesjs from 'aes-js';

import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function NewItem(props) {
	var dispatch = useContext(ChipDriveContext);

	var dropdown = useRef(null);
	var [createPrompt, setCreatePrompt] = useState(false);
	const uploadRef = useRef(null);

	var readFileAsync = (file) => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;

			reader.readAsArrayBuffer(file);
		});
	}

	var upload = async (e) => {
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

				var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
				var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(0));

				const CHUNK_SIZE = (1024 * 1024);

				for(var start = 0; start < file.size; start += CHUNK_SIZE) {
					var end = Math.min(start + CHUNK_SIZE, file.size);

					var chunk = file.slice(start, end);

					var buffer = new Uint8Array(await readFileAsync(chunk));

					// for(var i = 0; i < buffer.length; i++) {
					// 	buffer[i] ^= 0x50;
					// }

					var encrypted = aesCtr.encrypt(buffer);

					await IO.put(`/api/v2/drive/object/${body.id}/${start}`, encrypted, (e) => {
						var progress = e.toFixed(2);
						console.log(`Uploading ${progress}%`);
					});
				}

				// await IO.put(`/api/v2/drive/object/${body.id}`, file, (e) => {
				// 	var progress = e.toFixed(2);
				// 	console.log(`Uploading ${progress}%`);

				// 	dispatch({
				// 		type: "task", 
				// 		id: taskid, 
				// 		task: {
				// 			name: `Uploading ${file.name}`,
				// 			progress: progress
				// 		}
				// 	});
				// });

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
	}

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