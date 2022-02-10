import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Modal(props, ref) {
	var [open, setOpen] = useState(open || false);

	useImperativeHandle(ref, () => ({
		close: () => {
			setOpen((open) => !open);
		}
	}));

	useEffect(() => {
		if(props.open === true) {
			setOpen(true);
		} else {
			setOpen(false);
		}
    }, [props.open]);

	if(props.trigger) {
		props.trigger.props.onClick = () => {
			setOpen((open) => !open);
		}
	}

	function renderContent() {
		return (
			<div className={cssf(css, "p-overlay ")}>
				<div className={cssf(css, "p-content")} modalid={Math.random()}>
					{props.children}
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			{props.trigger}
			{open && ReactDOM.createPortal(renderContent(), document.body)}
		</React.Fragment>
	);
}

export default forwardRef(Modal);