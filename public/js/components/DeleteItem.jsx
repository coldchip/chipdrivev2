import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class DeleteItem extends React.Component {
	constructor() {
		super();
	}
	renderDropdown() {
		return (
			<button className="col-12 cd-option-modal-button text">
				<i className="fas fa-trash-alt me-2"></i>SS
			</button>
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
					modal
				>
					<div className="row cd-option-modal m-0 p-0">
						{this.renderDropdown()}
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default DeleteItem;