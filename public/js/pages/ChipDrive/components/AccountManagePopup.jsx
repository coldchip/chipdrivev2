import React, { useEffect, useState, useContext } from 'react';
import ContentLoader from 'react-content-loader'

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Popup from './Popup.jsx';
import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function AccountManage(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [name, setName] = useState("...");
	const [username, setUsername] = useState("...");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	var loadAccount = () => {
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

	var body;

	if(!error) {
		if(!loading) {
			body = (
				<div className={cssf(css, "container account-manage-popup pt-5")}>
					<h1 className={cssf(css, "title text")}>Manage Your Account</h1>
					<div className={cssf(css, "row mt-5")}>
						<div className={cssf(css, "col-md-6 col-sm-12")}>
							<label className={cssf(css, "label text")}>First Name</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} />

							<label className={cssf(css, "label text")}>Email</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} />		
						</div>
						<div className={cssf(css, "col-md-6 col-sm-12")}>
							<label className={cssf(css, "label text")}>Last Name</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} />

							<label className={cssf(css, "label text")}>Phone Number</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} />						
						</div>				
					</div>
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
		<Popup fullscreen {...props}>
			{body}
		</Popup>
	);
}

export default AccountManage;