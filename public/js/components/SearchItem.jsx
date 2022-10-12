import React, { useContext } from 'react';

import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function SearchItem(props) {
	var dispatch = useContext(ChipDriveContext);

	return (
		<form className={cssf(css, "header-search ms-5 me-5 ps-2")}>
			<i className="fa fa-search"></i>
			<input type="text" onChange={(e) => {
					dispatch({
						type: "filter", 
						data: e.target.value
					});
			}} className={cssf(css, "ps-2 text")} placeholder="Search Drive" />
		</form>
	);
}

export default SearchItem;