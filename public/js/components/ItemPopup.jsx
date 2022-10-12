import React from 'react';

import Types from '../Types';
import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function ItemPopup(props) {
	var download = () => {
		var {item} = props;

		var link = `/api/v2/drive/object/${item.id}`;
			
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

	var renderView = () => {

		var {item} = props;

		var ext = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
		if(Types.image.indexOf(ext) >= 0) {
			return (
				<img className={cssf(css, "preview-image")} src={ `/api/v2/drive/object/${item.id}` } />
			)
		} else if(Types.video.indexOf(ext) >= 0) {
			return (
				<video className={cssf(css, "preview-video")} controls>
					<source type="video/mp4" src={ `/api/v2/drive/object/${item.id}` } />
				</video>
			)
		} else if(Types.audio.indexOf(ext) >= 0) {
			return (
				<audio className={cssf(css, "preview-audio")} controls="true" preload="auto">
					<source type="audio/mp3" src={ `/api/v2/drive/object/${item.id}` } />
				</audio>
			)
		} else {
			return (
				<div className={cssf(css, "notice-container mt-2")}>
					<p className={cssf(css, "notice-text text")}>Unable to preview</p>
					<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon mt-3")}></i>	
					<button className={cssf(css, "notice-button text mt-4")} onClick={download}>
						<i className={cssf(css, "!fa !fa-download me-2")}></i>
						Download Instead
					</button>
				</div>
			)
		}
	}

	return (
		<Popup {...props}>
			<div className={cssf(css, "preview-popup")}>
				{renderView()}
			</div>
		</Popup>
	);
}

export default ItemPopup;