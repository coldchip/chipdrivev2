import React from 'react';
import { createRef } from 'react';
import Prompt from './Prompt.jsx';
import Confirm from './Confirm.jsx';
import Popup from 'reactjs-popup';

class ItemOption extends React.Component {
	constructor() {
		super();
		this.modal = createRef();
	}
	closeModal() {
		this.modal.current.close();
	}
	rename(name) {
		var api = this.props.api;
		api.rename(this.props.item.id, name).then(() => {
			this.props.relist();
		}).catch((e) => {
			this.props.onError(e);
		});
	}
	delete(name) {
		var api = this.props.api;
		api.delete(this.props.item.id).then(() => {
			this.props.relist();
		}).catch((e) => {
			this.props.onError(e);
		});
	}
	download(name) {
		var api = this.props.api;
		var link = api.getStreamLink(this.props.item.id);
			
		var a = document.createElement("a");
		a.style.display = "none";
		a.style.width = "0px";
		a.style.height = "0px";
		a.href = link;
		a.download = this.props.item.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

	}
	renderDropdown() {
		var api = this.props.api;
		return (
			<React.Fragment>
				<Prompt title="Rename Item" trigger={
					<button className="col-12 cd-option-modal-button text">
						<i className="fas fa-pen-square me-2"></i>Rename
					</button>
				} onAccept={(name) => this.rename(name)} />

				<Confirm title="Delete Item" trigger={
					<button className="col-12 cd-option-modal-button text">
						<i className="fas fa-trash-alt me-2"></i>Delete
					</button>
				} onAccept={this.delete.bind(this)} />

				<Confirm title="Download this item?" trigger={
					<button className="col-12 cd-option-modal-button text">
						<i className="fas fa-arrow-circle-down me-2"></i>Download
					</button>
				} onAccept={this.download.bind(this)} />
			</React.Fragment>
		)
	}
	render() {
		return (
			<React.Fragment>
				<Popup 
					trigger={this.props.trigger} 
					open={this.props.open} 
					onClose={this.props.onClose} 
					keepTooltipInside=".chipdrive-body"
					closeOnDocumentClick
					ref={this.modal}
					nested
				>
					<div className="row cd-option-modal m-0 p-0">
						{this.renderDropdown()}
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default ItemOption;