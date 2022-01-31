import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ChipDrive from './ChipDrive.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	genToken(length = 32) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for(var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	
	render() {
		return ( 
			<ChipDrive endpoint="http://192.168.10.141:8193" token={this.genToken()} />
		);
	}
}

ReactDOM.render(<App />, document.body);