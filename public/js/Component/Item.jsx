import React, { useContext } from 'react';

import DispatchContext from './../Context/DispatchContext.jsx';

import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Item(props) {
	var dispatch = useContext(DispatchContext);

	const TYPE_FILE   = 1;
	const TYPE_FOLDER = 2;

	if(props.item.type === TYPE_FILE) {
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
	} 

	if(props.item.type === TYPE_FOLDER) {
		return (
			<div className={cssf(css, "list-item")}>
				<ItemOption 
					trigger={
						<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
					} 
					item={props.item} 
				/>

				<div className={cssf(css, "list-item-inner")} onClick={() => {
					var {item} = props;
					dispatch({
						type: "list", 
						id: item.id
					});
				}}>
					<i className={cssf(css, "!fas !fa-folder item-icon")}></i>
					<p className={cssf(css, "item-label text")}>{props.item.name}</p>
				</div>
			</div>
		)
	}
}

export default Item;
