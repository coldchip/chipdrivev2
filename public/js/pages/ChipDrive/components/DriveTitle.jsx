import React, { useContext, useState, useEffect } from 'react';

import ContentLoader from 'react-content-loader'

import fetch from './../../../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Prompt from './Prompt.jsx';

import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

function DriveTitle(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	// rename prompt
	const [renamePrompt, setRenamePrompt] = useState(false);
	const [renamePromptLoading, setRenamePromptLoading] = useState(false);
	const [renamePromptError, setRenamePromptError] = useState("");

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
					type: "login",
					data: true
				});
			} else {
				setError(body.message);
			}
		}).finally(() => {
			setLoading(false);
		});
	}, [dispatch, props.id, token]);

	var rename = (name) => {
		setRenamePromptLoading(true);
		setRenamePromptError(undefined);

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
			setRenamePrompt(false);
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				setRenamePrompt(false);
				dispatch({
					type: "login",
					data: true
				});
			} else {
				setRenamePromptError(body.message);
			}
		}).finally(() => {
			setRenamePromptLoading(false);
		});
	}

	if(!loading) {
		return (
			<div className={cssf(css, "label")}>
				<p className={cssf(css, "label-text text")}>
					<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
					{name}
				</p>

				<p onClick={() => {
					setRenamePrompt(true);
					setRenamePromptLoading(false);
					setRenamePromptError("");
				}} className={cssf(css, "label-edit text")}>EDIT</p>

				<Prompt
					title="Rename Drive"
					open={renamePrompt}
					loading={renamePromptLoading}
					error={renamePromptError}
					onAccept={(input) => {
						rename(input);
					}}
					onClose={() => {
						setRenamePrompt(false);
					}}
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