import React, { useCallback, useContext } from 'react';

import fetch from './../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Popup from './Popup.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function PlanPopup(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	var purchase = useCallback((name) => {
		fetch("/api/v2/purchase", {
			method: "POST",
			body: new URLSearchParams({
				id: Math.random()
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
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
					type: "login",
					data: true
				});
			} else {
				// error
			}
		});
	}, [dispatch, token]);

	return (
		<Popup fullscreen {...props}>
			<div className={cssf(css, "container plan-popup pt-5")}>
				<h1 className={cssf(css, "title text")}>
					ChipDrive Plans
				</h1>
				<div className={cssf(css, "plans mt-5")}>
					<div className={cssf(css, "plan")}>
						<h2 className={cssf(css, "title text")}>
							Basic
						</h2>
						<h2 className={cssf(css, "size text mt-2")}>
							100 GB
						</h2>
						<h3 className={cssf(css, "price text mt-4")}>
							SGD 9.99 / month
						</h3>

						<button className={cssf(css, "purchase text mt-4")} onClick={() => purchase()}>
							Get started
						</button>
					</div>
					<div className={cssf(css, "plan")}>
						<h2 className={cssf(css, "title text")}>
							Standard
						</h2>
						<h2 className={cssf(css, "size text mt-2")}>
							500 GB
						</h2>
						<h3 className={cssf(css, "price text mt-4")}>
							SGD 19.99 / month
						</h3>

						<button className={cssf(css, "purchase text mt-4")}>
							Get started
						</button>
					</div>
					<div className={cssf(css, "plan")}>
						<h2 className={cssf(css, "title text")}>
							Premium
						</h2>
						<h2 className={cssf(css, "size text mt-2")}>
							1000 GB
						</h2>
						<h3 className={cssf(css, "price text mt-4")}>
							SGD 29.99 / month
						</h3>

						<button className={cssf(css, "purchase text mt-4")}>
							Get started
						</button>
					</div>

				</div>
			</div>
		</Popup>
	);
}

export default PlanPopup;