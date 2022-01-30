import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ChipDrive from './ChipDrive.jsx';

class Main extends React.Component {
	constructor() {
		super();
	}
	
	render() {
		return ( 
			<ChipDrive token="test" />
		);
	}
}

ReactDOM.render(<Main />, document.body);