import React from 'react';
import Popup from 'reactjs-popup';
import ButtonGreen from './ButtonGreen.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Account(props) {
	return (
		<Popup 
			trigger={props.trigger}
			keepTooltipInside="body"
			modal
		>
			<div className={cssf(css, "cd-account-modal")}>
				<img className={cssf(css, "account-profile")} src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" />
				<p className={cssf(css, "account-name text mt-3")}>Ryan Loh</p>
				<p className={cssf(css, "account-email text mt-2")}>ryan@coldchip.ru</p>
				
				<ButtonGreen className={cssf(css, "mt-4")}>
					<i className={cssf(css, "!fas !fa-pen me-2")}></i>
					Manage Account
				</ButtonGreen>
			</div>
		</Popup>
	);
}

export default Account;