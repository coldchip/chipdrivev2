import React, { useEffect, useState, useContext } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import profile from '../../img/profile.png';

import Popup from 'reactjs-popup';
import Loader from './Loader.jsx';
import ButtonGreen from './ButtonGreen.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Account(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var [name, setName] = useState("...");
	var [username, setUsername] = useState("...");

	const [loading, setLoading] = useState(false);

	var loadAccount = () => {
		setLoading(true);

		fetch("/api/v2/users/@me", {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setLoading(false);

			setName(body.name);
			setUsername(body.username);
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				dispatch({
					type: "alert", 
					title: body.message
				});
			}
		});
	}

	return (
		<Popup 
			trigger={props.trigger}
			keepTooltipInside="body"
			onOpen={loadAccount}
			modal
		>
			{
				loading 
				? 
				<Loader />
				:
				<div className={cssf(css, "cd-account-modal")}>
					<img className={cssf(css, "account-profile")} src={profile} />
					<p className={cssf(css, "account-name text mt-3")}>
						{name}
					</p>
					<p className={cssf(css, "account-email text mt-2")}>
						{username}
					</p>
					
					<ButtonGreen className={cssf(css, "mt-4")}>
						<i className={cssf(css, "!fas !fa-pen me-2")}></i>
						Manage Account
					</ButtonGreen>
				</div>
			}
		</Popup>
	);
}

export default Account;