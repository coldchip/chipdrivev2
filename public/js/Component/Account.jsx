import React, { useEffect, useState, useContext } from 'react';
import ContentLoader from 'react-content-loader'

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import profile from '../../img/profile.png';

import Popup from 'reactjs-popup';
import AccountManage from './AccountManage.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Account(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [name, setName] = useState("...");
	const [username, setUsername] = useState("...");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	var loadAccount = () => {
		setLoading(true);
		setError(undefined);

		fetch("/api/v2/users/@me", {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setName(body.name);
			setUsername(body.username);
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				setError(body.message);
			}
		}).finally(() => {
			setLoading(false);
		});
	}

	var body;

	if(!error) {
		if(!loading) {
			body = (
				<div className={cssf(css, "cd-account-modal")}>
					<img className={cssf(css, "account-profile")} src={profile} />
					<p className={cssf(css, "account-name text mt-3")}>
						{name}
					</p>
					<p className={cssf(css, "account-email text mt-2")}>
						{username}
					</p>
					
					<AccountManage
						trigger={
							<button className={cssf(css, "account-button text mt-4") + " " + props.className} onClick={props.onClick}>
								<i className={cssf(css, "!fas !fa-pen me-2")}></i>
								Manage Account
							</button>
						}
					/>
				</div>
			);
		} else {
			body = (
				<ContentLoader style={{
					display: 'block',
					width: '100%',
					height: '130px',
					margin: '20px 15px'
				}}>
					<circle cx="25" cy="25" r="25"/>
					<rect x="60" y="0" rx="4" ry="4" width="200" height="20" />
					<rect x="60" y="30" rx="4" ry="4" width="200" height="20" />

					<circle cx="25" cy="105" r="25"/>
					<rect x="60" y="80" rx="4" ry="4" width="200" height="20" />
					<rect x="60" y="110" rx="4" ry="4" width="200" height="20" />

					
				</ContentLoader>
			);
		}
	} else {
		body = (
			<p className={cssf(css, "text")}>Error: {error}</p>
		);
	}

	return (
		<Popup 
			trigger={props.trigger}
			keepTooltipInside="body"
			onOpen={loadAccount}
			modal
			nested
		>
			{body}
		</Popup>
	);
}

export default Account;