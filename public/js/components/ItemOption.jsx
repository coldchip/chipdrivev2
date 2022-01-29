import React from 'react';
import DeleteItem from './DeleteItem.jsx';
import Prompt from './Prompt.jsx';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class ItemOption extends React.Component {
	constructor() {
		super();
	}
	renderDropdown() {
		var api = this.props.api;
		return (
			<React.Fragment>
				<Prompt trigger={
					<button  className="col-12 cd-option-modal-button text">
						<i className="fas fa-pen-square me-2"></i>Rename
					</button>
				} />

					<button onClick={ () => {
						api.deleteItem(this.props.item.id).then(() => {
							this.props.relist();
						}).catch((e) => {
							alert(e);
						});
					} } className="col-12 cd-option-modal-button text">
						<i className="fas fa-trash-alt me-2"></i>Delete
					</button>
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