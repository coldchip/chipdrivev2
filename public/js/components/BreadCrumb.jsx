import React, { useRef, useContext, useEffect, useState } from 'react';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function BreadCrumbs(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<p className={cssf(css, "breadcrumb text")} onClick={() => {
			dispatch({
				type: "list", 
				id: props.id
			});
		}}>
			{
				props.icon && 
				<i className={cssf(css, "!fas !fa-hdd breadcrumb-icon me-2")}></i>
			}
			{props.name}
		</p>
	);
}

export default BreadCrumbs;