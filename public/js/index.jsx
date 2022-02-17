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

	getQuery(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		    results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	login() {

	}
	
	render() {
		var endpoint = this.getQuery("endpoint") || "";
		var token = this.getQuery("token") || this.genToken();
		return ( 
			<React.StrictMode>
				<ChipDrive endpoint={endpoint} token={token} login={this.login} />
			</React.StrictMode>
		);
	}
}

ReactDOM.render(<App />, document.body);