import React, { useContext } from 'react';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';
import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Item(props) {
	var {onList, onTask} = useContext(ChipDriveContext);

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

				<div className={cssf(css, "list-item-inner")} onClick={() => { onList(props.item.id) }}>
					<i className={cssf(css, "!fas !fa-folder item-icon")}></i>
					<p className={cssf(css, "item-label text")}>{props.item.name}</p>
				</div>
			</div>
		)
	}
}

export default Item;
