import React, { useState, useContext, useEffect } from 'react';
import ContentLoader from 'react-content-loader'

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import profile from './../../../assets/img/profile.png';

import Popup from './Popup.jsx';
import AccountManagePopup from './AccountManagePopup.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function Account(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [managePopup, setManagePopup] = useState(false);

	const [name, setName] = useState("...");
	const [username, setUsername] = useState("...");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		if(props.open === true) {
			setLoading(true);
			setError(undefined);

			fetch("/api/v2/sso/@me", {
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
						type: "login",
						data: true
					});
				} else {
					setError(body.message);
				}
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [dispatch, props.open, token]);

	var body;

	if(!error) {
		if(!loading) {
			body = (
				<div className={cssf(css, "account-popup")}>
					<img className={cssf(css, "account-profile")} src={profile} />
					<p className={cssf(css, "account-name text mt-3")}>
						{name}
					</p>
					<p className={cssf(css, "account-email text mt-2")}>
						{username}
					</p>
					
					<button className={cssf(css, "account-button text mt-4")} onClick={() => setManagePopup(true)}>
						<i className={cssf(css, "!fas !fa-pen me-2")}></i>
						Manage Account
					</button>

					<AccountManagePopup
						open={managePopup}
						onClose={() => setManagePopup(false)}
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
		<Popup {...props}>
			{body}
		</Popup>
	);
}

export default Account;