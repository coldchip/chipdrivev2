import React, { useContext } from 'react';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Account from './Account.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

import logo from "../../img/logo.png";
import profile from "../../img/profile.png";

function Header(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<React.Fragment>
			<div className={cssf(css, "chipdrive-header")}>
				<i className={cssf(css, "!fa !fa-bars header-bars")} onClick={() => {
					dispatch({
						type:"sidebar"
					});
				}}></i>

				<a href="/">
					<img className={cssf(css, "header-logo ms-3")} src={logo} alt="ChipDrive Logo" />	
				</a>

				<form className={cssf(css, "header-search ms-5 me-5 ps-2")}>
					<i className="fa fa-search"></i>
					<input type="text" onChange={(e) => {
							dispatch({
								type: "filter", 
								filter: e.target.value
							});
					}} className={cssf(css, "ps-2 text")} placeholder="Search Drive" />
				</form>

				<div className={cssf(css, "flex-fill")}></div>

				<Account
					trigger={
						<img className={cssf(css, "header-profile me-3")} src={profile} alt="My Account" />
					}
				/>
			</div>
		</React.Fragment>
	);
}

export default React.memo(Header);