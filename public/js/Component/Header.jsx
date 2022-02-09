import React, { useContext } from 'react';

import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import NewItem from './NewItem.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Header(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<React.Fragment>
			<div className={cssf(css, "chipdrive-header")}>
				<i className={cssf(css, "!fa !fa-bars header-bars")} onClick={() => {
					dispatch({type:"sidebar"});
				}}></i>

				<a href="#">
					<img className={cssf(css, "header-logo")} src="./img/logo.png" alt="ChipDrive Logo" />	
				</a>

				<div className={cssf(css, "flex-fill")}></div>

				<NewItem 
					trigger={
						<button className={cssf(css, "header-upload text")}>
							<i className={cssf(css, "!fas !fa-plus me-2")}></i>
							New
						</button>
					} 
				/>
			</div>
		</React.Fragment>
	);
}

export default React.memo(Header);