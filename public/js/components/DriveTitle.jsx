import React, { useContext, useState, useEffect } from 'react';

import ContentLoader from 'react-content-loader'

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import DriveSettingsPopup from './DriveSettingsPopup.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveTitle(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [popupSettings, setPopupSettings] = useState(false);

	const [name, setName] = useState();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setLoading(true);
		setError(undefined);

		fetch(`/api/v2/drive/info/${props.id}`, {
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
	}, [dispatch, props.id, token]);

	if(!loading) {
		return (
			<div className={cssf(css, "label")}>
				<p className={cssf(css, "label-text text")}>
					<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
					{name}
				</p>

				<p onClick={() => setPopupSettings(true)} className={cssf(css, "label-edit text")}>EDIT</p>

				<DriveSettingsPopup
					open={popupSettings}
					onClose={() => setPopupSettings(false)}
					id={props.id}
				/>
			</div>
		);
	} else {
		return (
			<ContentLoader style={{
				display: 'block',
				width: '100%',
				height: '35px',
				margin: '20px 30px',
			}} backgroundColor="#cccccc" foregroundColor="#9d9d9d">
				<rect x="0" y="0" rx="5" ry="5" width="35" height="35" />
				<rect x="45" y="0" rx="4" ry="4" width="200" height="15" />
				<rect x="45" y="20" rx="4" ry="4" width="200" height="15" />
			</ContentLoader>
		);
	}
}

export default DriveTitle;