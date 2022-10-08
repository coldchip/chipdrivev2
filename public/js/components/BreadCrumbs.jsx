import React, { useRef, useContext, useEffect, useState } from 'react';

import ContentLoader from 'react-content-loader'

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import BreadCrumb from './BreadCrumb.jsx';

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

		fetch(`/api/v2/drive/breadcrumb/${props.folder}`, {
			method: "GET",
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
						breadcrumbs.map((breadcrumb, index) => {
							return (
								<>
									<BreadCrumb 
										icon={index === 0}
										name={breadcrumb.name}
										id={breadcrumb.id}
										key={breadcrumb.id}
									/>

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
				<ContentLoader style={{
					display: 'block',
					width: '100%',
					height: '25px',
					margin: '20px 30px',
				}} backgroundColor="#cccccc" foregroundColor="#9d9d9d">
					<rect x="0" y="0" rx="5" ry="5" width="25" height="25" />
					<rect x="35" y="0" rx="4" ry="4" width="200" height="10" />
					<rect x="35" y="15" rx="4" ry="4" width="200" height="10" />
				</ContentLoader>
			);
		}
	} else {
		return (
			<p className={cssf(css, "text mt-5")}>Error: {error}</p>
		);
	}
}

export default BreadCrumbs;