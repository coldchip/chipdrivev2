import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DropDown(props) {
	const menu = useRef(null);

	const [open, setOpen] = useState(false);

	const [x, setX] = useState(false);
	const [y, setY] = useState(false);

	var openMenu = useCallback((e) => {
		e.preventDefault();
		// setX(e.clientX);
		// setY(e.clientY);
		setOpen(true);

		let menuStyles = {
            top: e.clientY,
            left: e.clientX
        };

		const { innerWidth, innerHeight } = window;
        const rect = menu.current.getBoundingClientRect();

        if (menuStyles.top + rect.height > innerHeight) {
            menuStyles.top -= rect.height;
        }

        if (menuStyles.left + rect.width > innerWidth) {
            menuStyles.left -= rect.width;
        }

        if (menuStyles.top < 0) {
            menuStyles.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
        }

        if (menuStyles.left < 0) {
            menuStyles.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
        }

        setX(menuStyles.left);
		setY(menuStyles.top);
	}, [menu]);

	useEffect(() => {
		if(props.rightclick) {
			props.trigger.current.oncontextmenu = (e) => {
				if(props.trigger.current === e.target || props.multi) {
					openMenu(e);
				}
			}
		} else {
			props.trigger.current.onclick = (e) => {
				openMenu(e);
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
			<div ref={menu} className={cssf(css, "context-menu")} style={{
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