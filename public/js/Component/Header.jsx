import React, { useContext } from 'react';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Account from './Account.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

import logo from "../../img/logo.png";

function Header(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<React.Fragment>
			<div className={cssf(css, "chipdrive-header")}>
				<i className={cssf(css, "!fa !fa-bars header-bars")} onClick={() => {
					dispatch({type:"sidebar"});
				}}></i>

				<a href="#">
					<img className={cssf(css, "header-logo ms-3")} src={logo} alt="ChipDrive Logo" />	
				</a>

				<form className={cssf(css, "header-search ms-5 me-5 ps-2")}>
					<i class="fa fa-search"></i>
					<input type="text" className={cssf(css, "ps-2 text")} placeholder="Search Drive" onChange={e => dispatch({type: "filter", filter: e.target.value})} />
				</form>

				<div className={cssf(css, "flex-fill")}></div>

				<Account
					trigger={
						<img className={cssf(css, "header-profile me-3")} src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" />
					}
				/>
			</div>
		</React.Fragment>
	);
}

export default React.memo(Header);