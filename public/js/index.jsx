import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ChipDrive from './ChipDrive.jsx';

import "bootstrap"; 
import "bootstrap/dist/css/bootstrap.css";
import "../css/index.scss";

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