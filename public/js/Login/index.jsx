import React, { useState, useEffect } from 'react';

import fetch from './../fetch.js';

import logo from "./../assets/img/logo.png";

import css from "./style/index.scss";
import cssf from "./../CSSFormat";

function Login() {
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		document.title = "ChipDrive - Login";
	}, []);

	var login = (e) => {
		e.preventDefault();

		setError(null);
		setSuccess(null);
		setLoading(true);
		fetch(`/api/v2/sso/login`, {
			method: "POST",
			body: new URLSearchParams({
				username: username,
				password: password
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then((response) => {
			var {status, body} = response;

			setSuccess("Login success");

			localStorage.setItem("token", body.token);

			window.location.href = "/drive";
		}).catch((response) => {
			var {status, body} = response;

			setError(body.message);
		}).finally(() => {
			setLoading(false);
		});
	}

	return (
		<div className={cssf(css, "login-wrapper")}>
			<form className={cssf(css, "login")}>
				<img src={logo} className={cssf(css, "login-logo")}/>

				<h1 className={cssf(css, "login-title text")}>Log in to your account</h1>
				
				{
					error && 
					<div className={cssf(css, "login-error")}>
						<p className={cssf(css, "login-error-text text")}>{error}</p>
						<i className={cssf(css, "!fa-solid !fa-circle-xmark login-error-cancel")} onClick={() => {
							setError(null);
						}}></i>
					</div>
				}

				{
					success && 
					<div className={cssf(css, "login-success")}>
						<p className={cssf(css, "login-success-text text")}>{success}</p>
						<i className={cssf(css, "!fa-solid !fa-circle-xmark login-success-cancel")} onClick={() => {
							setSuccess(null);
						}}></i>
					</div>
				}
				<div className={cssf(css, "form-group")}>
					<input 
						type="text" 
						autocomplete="none"
						id="username" 
						className={cssf(css, `login-input text ${username.length > 0 && "active"}`)}
						value={username}
						onChange={e => setUsername(e.target.value)} 
					/>
					<label for="username" className={cssf(css, "login-label text")}>
						Username
					</label>
				</div>

				<div className={cssf(css, "form-group")}>
					<input 
						type="password" 
						id="password" 
						className={cssf(css, `login-input text ${password.length > 0 && "active"}`)} 
						value={password}
						onChange={e => setPassword(e.target.value)} 
					/>
					<label for="password" className={cssf(css, "login-label text")}>
						Password: 
					</label>
				</div>
				
				<button type="button" className={cssf(css, `login-submit ${loading ? "submit-loading" : null} text`)} onClick={login} disabled={loading}>
					<span>Continue</span>
				</button>
			</form>
		</div>
	);
}

export default Login;