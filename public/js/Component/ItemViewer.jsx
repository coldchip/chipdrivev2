import React, { useContext } from 'react';

import APIContext from './../Context/APIContext.jsx';

import Types from '../Types';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function ItemViewer(props) {
	var api = useContext(APIContext);

	function renderView() {

		var {item} = props;

		var ext = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
		if(Types.image.indexOf(ext) >= 0) {
			return (
				<img className={cssf(css, "cd-preview-modal-image")} src={ api.getStreamLink(item.id) } />
			)
		} else if(Types.video.indexOf(ext) >= 0) {
			return (
				<video className={cssf(css, "cd-preview-modal-video")} controls>
					<source type="video/mp4" src={ api.getStreamLink(item.id) } />
				</video>
			)
		} else if(Types.audio.indexOf(ext) >= 0) {
			return (
				<audio className={cssf(css, "cd-preview-modal-audio")} controls="true" preload="auto">
					<source type="audio/mp3" src={ api.getStreamLink(item.id) } />
				</audio>
			)
		} else {
			return (
				<div className={cssf(css, "notice-container mt-2")}>
					<p className={cssf(css, "notice-text text")}>Unable to preview</p>
					<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon")}></i>	
				</div>
			)
		}
	}

	return (
		<React.Fragment>
			<Popup 
				open={props.open} 
				trigger={props.trigger}
				onClose={props.onClose}
				closeOnDocumentClick
				modal
			>
				<div className={cssf(css, "cd-preview-modal")}>
					{renderView()}
				</div>
			</Popup>
		</React.Fragment>
	);
}

export default ItemViewer;