import React from 'react';
import { createRef } from 'react';
import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';

class NewItem extends React.Component {
	constructor() {
		super();
		this.uploadRef = createRef();
		this.modal = createRef();
	}
	closeModal() {
		this.modal.current.close();
	}
	async upload(e) {
		var api = this.props.api;
		try {
			var completed = 0;
			var files = e.target.files;
			for(var i = 0; i < files.length; i++) {
				var res = await api.createFile(files[i].name); // stage 1 - create the file
				await api.put(files[i], res.id, (e) => { // state 2 - PUT the data
					console.log(`Uploading ${(((completed + e) / (files.length))).toFixed(2)}%`);
				});
				completed += 100;
			}
			this.props.onList();
		} catch(e) {
			this.props.onError(e);
		}
	}
	create(name) {
		var api = this.props.api;
		api.createFolder(name).then(() => {
			this.props.onList();
		}).catch((e) => {
			this.props.onError(e);
		});
	}
	renderDropdown() {
		return (
			<React.Fragment>
				<button onClick={() => {
					this.uploadRef.current.click()
				}} class="col-12 cd-option-modal-button text">
					<i class="fas fa-upload me-2"></i>
					Upload
				</button>

				<Prompt title="Create Folder" trigger={
					<button class="col-12 cd-option-modal-button text">
						<i class="fas fa-folder me-2"></i>
						Folder
					</button>
				} onAccept={(name) => this.create(name)} />

				<input type="file" className="d-none" ref={this.uploadRef} onChange={this.upload.bind(this)} multiple />
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
					keepTooltipInside="body"
					closeOnDocumentClick
					ref={this.modal}
					nested
				>
					<div class="row cd-option-modal m-0 p-0">
						{this.renderDropdown()}
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default NewItem;