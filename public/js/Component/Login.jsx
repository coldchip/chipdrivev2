import React, { useEffect, useState, useContext, useCallback } from 'react';

import IO from './../IO.js';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Login() {
	var [username, setUsername] = useState("");
	var [password, setPassword] = useState("");
	var [error, setError] = useState("");

	var [loading, setLoading] = useState(false);
	var [preloading, setPreloading] = useState(false);

	var dispatch = useContext(ChipDriveContext);

	useEffect(() => {
		setPreloading(true);
		setTimeout(() => {
			setPreloading(false);
		}, 500);
	}, []);

	var login = useCallback(() => {
		setLoading(true);

		IO.post("/api/v2/login", {
			username: username, 
			password:password
		}).then(() => {
			setLoading(false);
			dispatch({
				type: "closeLogin"
			});
		}).catch((response) => {
			var {status, body} = response;

			setLoading(false);

			setError(body.message);
		});
	}, [dispatch, username, password]);

	return (
		<div className={cssf(css, "login-page")}>
			<form className={cssf(css, "login")}>
				{
					preloading
					?
					<Loader />
					:
					<React.Fragment>
						<h1 className={cssf(css, "text mb-3")} >Login to ChipDrive</h1>
						<label className={cssf(css, "label text")} for="username">Username: </label>
						<input 
							type="text" 
							className={cssf(css, "input text mb-3")} 
							id="username" 
							placeholder="Username"
							autocomplete="off" 
							autocapitalize={false}
							spellcheck={false}
							onChange={e => setUsername(e.target.value)}
						/>
						
						<label className={cssf(css, "label text")} for="password">Password: </label>
						<input 
							type="password" 
							className={cssf(css, "input text mb-3")} 
							id="password" 
							placeholder="Password" 
							onChange={e => setPassword(e.target.value)}
						/>
						
						{ 
							error.length > 0 && 
							<p className={cssf(css, "error text")}>
								<i className={cssf(css, "!fas !fa-exclamation-circle mb-2 me-2")}></i>
								{error}
							</p>
						}

						<button 
							type="button" 
							className={cssf(css, `submit ${loading ? "submit-loading" : null} text`)} 
							onClick={login} 
							disabled={loading}
						>
							{ !loading && <span>Login</span> }
						</button>
					</React.Fragment>
				}
			</form>
		</div>
	);
}

export default Login;