import React from 'react';
import Types from '../Types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class ItemViewer extends React.Component {
	constructor() {
		super();
	}
	renderView() {
		var api = this.props.api;

		var item = this.props.item;
		var ext = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
		if(Types.image.indexOf(ext) >= 0) {
			return (
				<img className="cd-preview-modal-image" src={ api.getStreamLink(item.id) } />
			)
		} else {
			return (
				<h1 className="text">Unable to preview</h1>
			)
		}
	}
	render() {
		return (
			<React.Fragment>
				<Popup 
					trigger={this.props.trigger} 
					open={this.props.open} 
					onClose={this.props.onClose} 
					closeOnDocumentClick
					modal
				>
					<div className="cd-preview-modal">
						{this.renderView()}
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default ItemViewer;