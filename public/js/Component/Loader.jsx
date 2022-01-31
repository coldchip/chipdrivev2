import React from 'react';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class Loader extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<React.Fragment>
				<div className={cssf(css, "spinner-container p-4")}>
					<img src="./img/loader.svg" className={cssf(css, "spinner")}/>
				</div>
			</React.Fragment>
		);
	}
}

export default Loader;