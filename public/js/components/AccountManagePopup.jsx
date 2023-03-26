import React, { useEffect, useState, useContext } from 'react';
import ContentLoader from 'react-content-loader'

import fetch from './../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Popup from './Popup.jsx';
import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function AccountManage(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [firstName, setFirstName] = useState("...");
	const [lastName, setLastName] = useState("...");
	const [username, setUsername] = useState("...");
	const [quota, setQuota] = useState(0);

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

				setFirstName(body.firstname);
				setLastName(body.lastname);
				setUsername(body.username);
				setQuota(body.quota);
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

	var update = () => {
		fetch("/api/v2/sso/@me", {
			method: "PATCH",
			body: new URLSearchParams({
				firstname: firstName,
				lastname: lastName,
				username: username,
				quota: quota
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				token: token
			}
		}).then((response) => {
			var {status, body} = response;


		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login",
					data: true
				});
			} else {

			}
		}).finally(() => {

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
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} onChange={e => setFirstName(e.target.value)} value={firstName} />

							<label className={cssf(css, "label text")}>Username</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} onChange={e => setUsername(e.target.value)} value={username} />		
						</div>
						<div className={cssf(css, "col-md-6 col-sm-12")}>
							<label className={cssf(css, "label text")}>Last Name</label>
							<input type="text" className={cssf(css, "input text mt-1 mb-3")} onChange={e => setLastName(e.target.value)} value={lastName} />

							<label className={cssf(css, "label text")}>Quota</label>
							<input type="number" className={cssf(css, "input text mt-1 mb-3")} onChange={e => setQuota(e.target.value)} value={quota} />						
						</div>
						<div className={cssf(css, "d-flex align-items-center justify-content-end")}>
							<button type="button" className={cssf(css, "submit text")} onClick={update}>Save</button>
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