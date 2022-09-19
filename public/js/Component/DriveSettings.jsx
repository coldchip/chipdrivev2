import React, { useState, useContext, useCallback } from 'react';
import ContentLoader from 'react-content-loader'

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import profile from '../../img/profile.png';

import Popup from 'reactjs-popup';
import AccountManage from './AccountManage.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveSettings(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [name, setName] = useState();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	var loadDrive = () => {
		setLoading(true);
		setError(undefined);

		fetch(`/api/v2/drive/object/${props.id}/info`, {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;
			setName(body.name);
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

	var saveDrive = () => {
		setLoading(true);
		setError(undefined);

		fetch(`/api/v2/drive/object/${props.id}`, {
			method: "PATCH",
			body: new URLSearchParams({
				name: name
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				token: token
			}
		}).then((response) => {
			var {status, body} = response;
			window.location.reload();
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				
			}
		}).finally(() => {
			setLoading(false);
		});
	}

	var body;

	if(!error) {
		if(!loading) {
			body = (
				<div className={cssf(css, "drivesettings")}>
					<form>
						<label className={cssf(css, "input-label text")}>Drive Name:</label>
						<input type="text" className={cssf(css, "input text mt-1")} placeholder="Drive Name" value={name} onChange={e => setName(e.target.value)}/>
						<div className={cssf(css, "submit-wrapper mt-3")}>
							<button type="button" className={cssf(css, "submit text")} onClick={saveDrive}>Save</button>
						</div>
					</form>
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
			onOpen={loadDrive}
			modal
			nested
		>
			{body}
		</Popup>
	);
}

export default DriveSettings;