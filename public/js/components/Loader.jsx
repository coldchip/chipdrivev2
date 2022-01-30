import React from 'react';
import css from "../../css/index.scss";

class Loader extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<React.Fragment>
				<div className={`${css["spinner-container"]} ${css["p-4"]}`}>
					<img src="./img/loader.svg" className={`${css["spinner"]}`}/>
				</div>
			</React.Fragment>
		);
	}
}

export default Loader;