import React from 'react';
import { createRef } from 'react';
import Prompt from './Prompt.jsx';
import Confirm from './Confirm.jsx';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class ItemOption extends React.Component {
	constructor(props) {
		super(props);
		this.modal = createRef();
	}
	closeModal() {
		this.modal.current.close();
	}
	rename(name) {
		var {api} = this.props;

		var taskid = 'task_' + Math.random();
		this.props.onTask(taskid, {
			name: `Renaming '${name}'`,
			progress: 0.0
		});

		api.rename(this.props.item.id, name).then(() => {
			this.props.onTask(taskid, {
				name: `Renamed '${name}'`,
				progress: 100.0
			});
			this.props.onList();
		}).catch((e) => {
			this.props.onError(e);
		});
	}
	delete() {
		var {api, item} = this.props;

		var taskid = 'task_' + Math.random();
		this.props.onTask(taskid, {
			name: `Deleting '${item.name}'`,
			progress: 0.0
		});

		api.delete(this.props.item.id).then(() => {
			this.props.onTask(taskid, {
				name: `Deleted '${item.name}'`,
				progress: 100.0
			});
			this.props.onList();
		}).catch((e) => {
			this.props.onError(e);
		});
	}
	download() {
		var {api, item} = this.props;

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
	renderDropdown() {
		var api = this.props.api;
		return (
			<React.Fragment>
				<Prompt 
					title="Rename Item" 
					trigger={
						<button className={cssf(css, "col-12 cd-option-modal-button text")}>
							<i className={cssf(css, "!fas !fa-pen-square me-2")}></i>Rename
						</button>
					} 
					onAccept={(name) => this.rename(name)} 
				/>

				<Confirm 
					title="Delete Item" 
					trigger={
						<button className={cssf(css, "col-12 cd-option-modal-button text")}>
							<i className={cssf(css, "!fas !fa-trash-alt me-2")}></i>Delete
						</button>
					} 
					onAccept={this.delete.bind(this)} 
				/>
				
				{
					this.props.item.type == 1
					?
					(
						<Confirm 
							title="Download this item?" 
							trigger={
								<button className={cssf(css, "col-12 cd-option-modal-button text")}>
									<i className={cssf(css, "!fas !fa-arrow-circle-down me-2")}></i>Download
								</button>
							} 
							onAccept={this.download.bind(this)} 
						/>
					)
					:
					null
				}
				
			</React.Fragment>
		)
	}
	render() {
		return (
			<React.Fragment>
				<Popup 
					open={this.props.open} 
					trigger={this.props.trigger}
					onClose={this.props.onClose}
					keepTooltipInside="body"
					closeOnDocumentClick
					ref={this.modal}
					arrow={false}
					nested
				>
					<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
						{this.renderDropdown()}
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default ItemOption;