import React, { useRef, useContext, useEffect, useState } from 'react';

import fetch from './../IO.js';

import TokenContext from './../Context/TokenContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function BreadCrumbs(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const [breadcrumbs, setBreadCrumbs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	const breadCrumbsRef = useRef(null)

	useEffect(() => {
		breadCrumbsRef.current.scrollTo(breadCrumbsRef.current.scrollWidth, 0);
	}, [props.breadcrumbs]);

	useEffect(() => {
		setBreadCrumbs([]);
		setLoading(true);
		setError(undefined);

		fetch("/api/v2/drive/breadcrumb", {
			method: "GET",
			query: {
				id: props.folder, 
			},
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setBreadCrumbs(body);
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

	}, [dispatch, props.folder, token]);

	if(!error) {
		if(!loading) {
			return (
				<div className={cssf(css, "breadcrumbs")} ref={breadCrumbsRef}>
					{
						breadcrumbs.map((breadcrumb) => {
							return (
								<>
									<p className={cssf(css, "breadcrumb text")} onClick={() => {
										dispatch({
											type: "list", 
											id: breadcrumb.id
										});
									}}>
										{breadcrumb.name}
									</p>

									<p className={cssf(css, "breadcrumb-seperator text")}>
										/
									</p>
								</>
							);
						})
					}
				</div>
			);
		} else {
			return (
				<Loader />
			);
		}
	} else {
		return (
			<p className={cssf(css, "text mt-5")}>Error: {error}</p>
		);
	}
}

export default BreadCrumbs;