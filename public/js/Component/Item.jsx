import React, { useContext } from 'react';

import APIContext from './../Context/APIContext.jsx';
import ReloadContext from './../Context/ReloadContext.jsx';

import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Item(props) {
	var api = useContext(APIContext);
	var onReload = useContext(ReloadContext);

	function onEnter() {
		var {item} = props;

		api.setFolder(item.id);
		onReload();
	}

	if(props.item.type == 1) {
		return (
			<div className={cssf(css, "list-item")}>
				<ItemOption 
					trigger={
						<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
					} 
					item={props.item} 
				/>

				<ItemViewer 
					trigger={
						<div className={cssf(css, "list-item-inner")}>
							<i className={cssf(css, "!fas !fa-file item-icon")}></i>
							<p className={cssf(css, "item-label text")}>{props.item.name}</p>
						</div>
					} 
					item={props.item} 
				/>
			</div>
			
		)
	} else {
		return (
			<div className={cssf(css, "list-item")}>
				<ItemOption 
					trigger={
						<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
					} 
					item={props.item} 
				/>

				<div className={cssf(css, "list-item-inner")} onClick={onEnter}>
					<i className={cssf(css, "!fas !fa-folder item-icon")}></i>
					<p className={cssf(css, "item-label text")}>{props.item.name}</p>
				</div>
			</div>
		)
	}
}

export default Item;
