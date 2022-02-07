import React, { useContext } from 'react';

import APIContext from './../Context/APIContext.jsx';
import ErrorContext from './../Context/ErrorContext.jsx';
import TaskContext from './../Context/TaskContext.jsx';
import ReloadContext from './../Context/ReloadContext.jsx';

import Prompt from './Prompt.jsx';
import Confirm from './Confirm.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function ItemOption(props) {
	var api = useContext(APIContext);
	var onError = useContext(ErrorContext);
	var onTask = useContext(TaskContext);
	var onReload = useContext(ReloadContext);

	function rename(name) {
		var taskid = 'task_' + Math.random();
		onTask(taskid, {
			name: `Renaming '${name}'`,
			progress: 0.0
		});

		api.rename(props.item.id, name).then(() => {
			onTask(taskid, {
				name: `Renamed '${name}'`,
				progress: 100.0
			});
			onReload();
		}).catch((e) => {
			onError(e);
		});
	}

	function remove() {
		var {item} = props;

		var taskid = 'task_' + Math.random();
		onTask(taskid, {
			name: `Deleting '${item.name}'`,
			progress: 0.0
		});

		api.delete(props.item.id).then(() => {
			onTask(taskid, {
				name: `Deleted '${item.name}'`,
				progress: 100.0
			});
			onReload();
		}).catch((e) => {
			onError(e);
		});
	}

	function download() {
		var {item} = props;

		var link = api.getStreamLink(item.id);
			
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

	function renderDropdown() {
		return (
			<React.Fragment>
				<Prompt 
					title="Rename Item" 
					trigger={
						<button className={cssf(css, "col-12 cd-option-modal-button text")}>
							<i className={cssf(css, "!fas !fa-pen-square me-2")}></i>Rename
						</button>
					} 
					onAccept={(name) => rename(name)} 
				/>

				<Confirm 
					title="Delete Item" 
					trigger={
						<button className={cssf(css, "col-12 cd-option-modal-button text")}>
							<i className={cssf(css, "!fas !fa-trash-alt me-2")}></i>Delete
						</button>
					} 
					onAccept={remove} 
				/>
				
				{
					props.item.type == 1
					?
					(
						<Confirm 
							title="Download this item?" 
							trigger={
								<button className={cssf(css, "col-12 cd-option-modal-button text")}>
									<i className={cssf(css, "!fas !fa-arrow-circle-down me-2")}></i>Download
								</button>
							} 
							onAccept={download} 
						/>
					)
					:
					null
				}
				
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

export default ItemOption;