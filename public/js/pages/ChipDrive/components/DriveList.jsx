import React, { useContext, useState, useEffect } from 'react';

import ContentLoader from 'react-content-loader'

import DriveButton from './DriveButton.jsx'

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function DriveList(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setList([]);
		setLoading(true);
		setError(undefined);

		fetch("/api/v2/drive/config", {
			method: "GET",
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setList(body);

			if(body.length > 0) {
				var drive = body[0];
				dispatch({
					type: "drive", 
					id: drive.id
				});
				dispatch({
					type: "list", 
					id: drive.id
				});
			}
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

	}, [dispatch, token]);

	if(!error) {
		if(!loading) {
			return (
				<div className={cssf(css, "drive-list")}>
					{
						list.map((drive) => {
							return (
								<DriveButton 
									name={drive.name}
									id={drive.id}
									key={drive.id}
								/>
							);
						})
					}
				</div>
			);
		} else {
			return (
				<ContentLoader style={{
					display: 'block',
					width: '100%',
					height: '130px',
					margin: '20px 0'
				}}>
					<rect x="0" y="0" rx="5" ry="5" width="50" height="50" />
					<rect x="60" y="0" rx="4" ry="4" width="200" height="20" />
					<rect x="60" y="30" rx="4" ry="4" width="200" height="20" />

					<rect x="0" y="80" rx="5" ry="5" width="50" height="50" />
					<rect x="60" y="80" rx="4" ry="4" width="200" height="20" />
					<rect x="60" y="110" rx="4" ry="4" width="200" height="20" />

					
				</ContentLoader>
			);
		}
	} else {
		return (
			<p className={cssf(css, "text mt-5")}>Error: {error}</p>
		);
	}
}

export default React.memo(DriveList);