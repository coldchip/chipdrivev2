import React, { useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';

import fetch from './../IO.js';
import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Confirm from './Confirm.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function LogoutPrompt(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var logout = useCallback((name) => {
		fetch("/api/v2/sso/logout", {
			method: "GET",
			headers: {
				token: token
			}
		}).then(() => {
			dispatch({
				type: "list"
			});
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
				dispatch({
					type: "token",
					token: ""
				});
			} else {
				dispatch({
					type: "task", 
					id: "0", 
					task: {
						name: `Error logging out`,
						progress: 100
					}
				});
			}
		});
	}, [dispatch, token]);

	return (
		<Confirm
			title="Are you sure?"
			open={props.open}
			onAccept={() => {
				logout();
				props.onAccept();
			}}
			onClose={props.onClose}
		/>
	);
}

export default LogoutPrompt;