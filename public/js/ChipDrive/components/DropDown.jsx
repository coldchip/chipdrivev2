import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import css from "./../style/index.scss";
import cssf from "./../../CSSFormat";

function DropDown(props) {
	const menu = useRef(null);

	const [open, setOpen] = useState(false);

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	useLayoutEffect(() => {
		if(open === true && menu) {
	        const rect = menu.current.getBoundingClientRect();

	        let tx = x;
	        let ty = y;

	        if(ty + rect.height > window.innerHeight) {
	            ty -= rect.height;
	        }

	        if(tx + rect.width > window.innerWidth) {
	            tx -= rect.width;
	        }

	        if(ty < 0) {
	            ty = rect.height < window.innerHeight ? (window.innerHeight - rect.height) / 2 : 0;
	        }

	        if(tx < 0) {
	            tx = rect.width < window.innerWidth ? (window.innerWidth - rect.width) / 2 : 0;
	        }

	        setX(tx);
			setY(ty);
		}
	}, [x, y, open]);

	useEffect(() => {
		if(props.rightclick) {
			props.trigger.current.oncontextmenu = (e) => {
				if(e.target === e.currentTarget || props.multi) {
					e.preventDefault();
					setOpen(true);
					setX(e.clientX);
					setY(e.clientY);
				}
			}
		} else {
			props.trigger.current.onclick = (e) => {
				e.preventDefault();
				setOpen(true);
				setX(e.clientX);
				setY(e.clientY);
			}
		}
	}, [props.trigger, props.rightclick, props.multi]);

	var content = (
		<div className={cssf(css, "context-menu-overlay")} onClick={() => {
			setOpen(false);
		}} onContextMenu={(e) => {
			e.preventDefault();
			setOpen(false);
		}}>
			<div ref={menu} className={cssf(css, "context-menu")} style={{
				left: `${x}px`,
				top: `${y}px`
			}}>
				{props.children}
			</div>
		</div>
	);
	
	var parent = document.getElementsByClassName(cssf(css, "chipdrive"))[0];

	return open && ReactDOM.createPortal(content, parent);
}

export default DropDown;