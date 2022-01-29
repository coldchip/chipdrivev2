import React from 'react';

class Loader extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<React.Fragment>
				<div class="spinner-container p-4">
					<img src="./img/loader.svg" class="spinner" />
				</div>
			</React.Fragment>
		);
	}
}

export default Loader;