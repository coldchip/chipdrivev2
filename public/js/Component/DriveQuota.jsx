import React, { useState, useEffect, useContext } from 'react';

import IO from './../IO.js';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveQuota(props) {
	var dispatch = useContext(ChipDriveContext);

	var [used, setUsed] = useState(0);
	var [available, setAvailable] = useState(0);

	useEffect(() => {
		IO.get("/api/v2/drive/quota").then((response) => {
			var {status, body} = response;

			setUsed(body.used);
			setAvailable(body.available);

		}).catch((response) => {
			var {status, body} = response;
			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				dispatch({
					type: "alert", 
					title: body.message
				});
			}
		});
	}, [dispatch, props.folder]);

	var formatBytes = (bytes, decimals) => {
		if(bytes == 0) return '0 B';

		var k = 1024,
		dm = decimals || 2,
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	return (
		<React.Fragment>
			<div className={cssf(css, "sidebar-seperator")}></div>
			<div className={cssf(css, "sidebar-quota pt-3 pb-3")} tabIndex="0">
				<div className={cssf(css, "quota-header text")}>
					<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
					My Storage
				</div>
				<div className={cssf(css, "quota-bar mt-3")}>
					<div style={{
						width: `${Math.min(((used / available) * 100).toFixed(5), 100)}%`
					}} className={cssf(css, "quota-bar-used")}></div>
				</div>
				<div className={cssf(css, "quota-usage text mt-2")}>
					{formatBytes(used, 1)} of {formatBytes(available, 1)} used
				</div>
				<div className={cssf(css, "quota-warning text mt-2")}>
					<i className={cssf(css, "!fas !fa-info-circle me-2")}></i>
					Quota almost full
				</div>
			</div>
			<div className={cssf(css, "sidebar-seperator")}></div>
		</React.Fragment>
	);
}

export default DriveQuota;