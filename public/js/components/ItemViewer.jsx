import React from 'react';
import Types from '../Types';
import Popup from 'reactjs-popup';

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
		} else if(Types.video.indexOf(ext) >= 0) {
			return (
				<video class="cd-preview-modal-video" controls>
					<source type="video/mp4" src={ api.getStreamLink(item.id) } />
				</video>
			)
		} else if(Types.audio.indexOf(ext) >= 0) {
			return (
				<audio class="cd-preview-modal-audio" controls="true" preload="auto">
					<source type="audio/mp3" src={ api.getStreamLink(item.id) } />
				</audio>
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