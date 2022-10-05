import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DropDown(props) {

	const [open, setOpen] = useState(false);

	const [x, setX] = useState(false);
	const [y, setY] = useState(false);

	useEffect(() => {
		if(props.rightclick) {
			props.trigger.current.oncontextmenu = (e) => {
				if(props.trigger.current === e.target || props.multi) {
					e.preventDefault();
					setX(e.clientX);
					setY(e.clientY);
					setOpen(true);
				}
			}
		} else {
			console.log(props, props.trigger.current);
			props.trigger.current.onclick = (e) => {
				e.preventDefault();
				setX(e.clientX);
				setY(e.clientY);
				setOpen(true);
			}
		}
	}, []);

	var content = (
		<div className={cssf(css, "context-menu-overlay")} onClick={() => {
			setOpen(false);
		}} onContextMenu={(e) => {
			e.preventDefault();
			setOpen(false);
		}}>
			<div className={cssf(css, "context-menu")} style={{
				left: `${x}px`,
				top: `${y}px`
			}}>
				{props.children}
			</div>
		</div>
	);

	return open && ReactDOM.createPortal(content, document.body);
}

export default DropDown;