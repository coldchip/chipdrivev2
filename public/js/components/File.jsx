import React, { useContext } from 'react';

import Types from '../Types';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { useDrag, useDrop } from 'react-dnd'

import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function File(props) {
	var dispatch = useContext(ChipDriveContext);


	const [{isDragging}, drag] = useDrag(() => ({
		type: "FILE",
		item: props.item,
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	var ext = props.item.name.substr(props.item.name.lastIndexOf('.') + 1).toLowerCase();
	return (
		<div className={cssf(css, "list-item")} ref={drag}>
			<ItemOption 
				trigger={
					<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
				} 
				item={props.item} 
			/>

			<ItemViewer 
				trigger={
					<div className={cssf(css, "list-item-inner")}>
						{
							Types.image.indexOf(ext) >= 0 && props.item.thumbnail ?
							<img 
								src={`/api/v2/drive/object/${props.item.thumbnail}`}
								className={cssf(css, "!fas !fa-file item-icon-image")} 
								loading="lazy"
							/>
							:
							<i className={cssf(css, "!fas !fa-file item-icon")}></i>
						}
						<p className={cssf(css, "item-label text")}>{props.item.name}</p>
					</div>
				} 
				item={props.item} 
			/>
		</div>
		
	)
}

export default File;
