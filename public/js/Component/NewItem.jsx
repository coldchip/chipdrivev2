import React, { useRef, useContext } from 'react';

import APIContext from './../Context/APIContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function NewItem(props) {
	var api = useContext(APIContext);
	var dispatch = useContext(ChipDriveContext);

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

				var res = await api.createFile(files[i].name); // stage 1 - create the file
				await api.put(files[i], res.id, (e) => { // state 2 - PUT the data
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
		} catch(e) {
			dispatch({type: "error", reason: e});
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

		api.createFolder(name).then(() => {
			dispatch({
				type: "task", 
				id: taskid, 
				task: {
					name: `Created '${name}'`,
					progress: 100
				}
			});

			dispatch({type: "list"});
		}).catch((e) => {
			dispatch({type: "error", reason: e});
		});
	}

	function renderDropdown() {
		return (
			<React.Fragment>
				<button onClick={() => {
					uploadRef.current.click()
				}} className={cssf(css, "col-12 cd-option-modal-button text")}>
					<i className={cssf(css, "!fas !fa-upload me-2")}></i>
					Upload
				</button>

				<Prompt title="Create Folder" trigger={
					<button className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-folder me-2")}></i>
						Folder
					</button>
				} onAccept={(name) => create(name)} />

				<input type="file" className={cssf(css, "d-none")} ref={uploadRef} onChange={upload} multiple />
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<Popup 
				open={props.open} 
				trigger={props.trigger}
				keepTooltipInside="body"
				closeOnDocumentClick
				arrow={false}
				nested
			>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					{renderDropdown()}
				</div>
			</Popup>
		</React.Fragment>
	);
}

export default NewItem;