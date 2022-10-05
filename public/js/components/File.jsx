import React, { useContext, useState, useRef, useEffect } from 'react';

import Types from '../Types';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import { useDrag, useDrop } from 'react-dnd'

import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function File(props) {
	var dispatch = useContext(ChipDriveContext);

	const [hasMouse, setHasMouse] = useState(false);

	const [popupViewer, setPopupViewer] = useState(false);
	const optionRef = useRef(null);
	const ref = useRef(null);

	useEffect(() => {
		function checkMouse() {
			setHasMouse(matchMedia('(pointer:fine)').matches);
		}

		checkMouse();

		window.addEventListener("resize", checkMouse);

		return () => window.removeEventListener("resize", checkMouse);
	}, []);

	const [{isDragging}, drag] = useDrag(() => ({
		type: "FILE",
		item: props.item,
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	drag(ref);

	var ext = props.item.name.substr(props.item.name.lastIndexOf('.') + 1).toLowerCase();
	return (
		<>
			<div className={cssf(css, "list-item")} ref={ref}>
				<i ref={optionRef} style={{display: hasMouse ? "none" : "block"}} className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>

				<div className={cssf(css, "list-item-inner")} onClick={() => setPopupViewer(true)}>
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
			</div>

			<ItemViewer 
				open={popupViewer}
				onClose={() => setPopupViewer(false)}
				item={props.item} 
			/>

			<ItemOption
				trigger={optionRef}
				item={props.item} 
			/>

			<ItemOption
				rightclick 
				multi
				trigger={ref}
				item={props.item} 
			/>
		</>
	)
}

export default File;
