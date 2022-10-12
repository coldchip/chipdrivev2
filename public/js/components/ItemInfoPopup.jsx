import React from 'react';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function ItemInfoPopup(props) {
	var formatBytes = (bytes, decimals) => {
		if(bytes == 0) return '0 B';

		var k = 1024,
		dm = decimals || 2,
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	return (
		<Popup {...props}>
			<div className={cssf(css, "iteminfo-popup")}>
				<table>
					<tr>
						<td className={cssf(css, "text")}><strong>Item Name: </strong></td>
						<td className={cssf(css, "text")}>{props.item.name}</td>
					</tr>
					<tr>
						<td className={cssf(css, "text")}><strong>Item ID: </strong></td>
						<td className={cssf(css, "text")}>{props.item.id}</td>
					</tr>
					<tr>
						<td className={cssf(css, "text")}><strong>Item Type: </strong></td>
						<td className={cssf(css, "text")}>{props.item.type === 1 ? "File" : "Folder"}</td>
					</tr>
					<tr>
						<td className={cssf(css, "text")}><strong>Item Size: </strong></td>
						<td className={cssf(css, "text")}>{formatBytes(props.item.size)}</td>
					</tr>
					<tr>
						<td className={cssf(css, "text")}><strong>Modified: </strong></td>
						<td className={cssf(css, "text")}>{props.item.updatedAt}</td>
					</tr>
					<tr>
						<td className={cssf(css, "text")}><strong>Created: </strong></td>
						<td className={cssf(css, "text")}>{props.item.createdAt}</td>
					</tr>
				</table>
			</div>
		</Popup>
	);
}

export default ItemInfoPopup;