import React, { useContext, useRef } from 'react';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import SearchItem from './SearchItem.jsx';
import AccountDropdown from './AccountDropdown.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

import logo from "../../img/logo.png";
import profile from "../../img/profile.png";

function DriveHeader(props) {
	var dispatch = useContext(ChipDriveContext);

	const accountRef = useRef(null);

	return (
		<React.Fragment>
			<div className={cssf(css, "chipdrive-header")}>
				<i className={cssf(css, "!fa !fa-bars header-bars")} onClick={() => {
					dispatch({
						type: "sidebar"
					});
				}}></i>

				<a href="/">
					<img className={cssf(css, "header-logo ms-3")} src={logo} alt="ChipDrive Logo" />	
				</a>

				<SearchItem />

				<div className={cssf(css, "flex-fill")}></div>

				<img ref={accountRef} className={cssf(css, "header-profile me-3")} src={profile} alt="My Account" />

				<AccountDropdown
					trigger={accountRef}
				/>
			</div>
		</React.Fragment>
	);
}

export default React.memo(DriveHeader);