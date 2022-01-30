import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createRef } from 'react';

import API from './API.js';

import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import List from './components/List.jsx';
import Alert from './components/Alert.jsx';

import css from "../css/index.scss";

class ChipDrive extends React.Component {
	constructor() {
		super();
		this.list = createRef();

		this.state = {
            sidebarOpen: false,
            error: false,
            reason: ""
        };
		this.api = new API();
		this.api.setEndpoint("http://192.168.10.141:8193");
	}
	
	componentDidMount() {
		
	}

	hideError(error) {
		this.setState({
            error: false,
            reason: ""
        });
	}

	onError(error) {
		this.setState({
            error: true,
            reason: error
        });
	}

	onSidebar() {
		this.setState({sidebarOpen: !this.state.sidebarOpen});
	}

	onList() {
		this.list.current.onList();
	}

	render() {
		return ( 
			<React.Fragment>
				<div className={css["chipdrive"]}>
					<Header 
						onSidebar={this.onSidebar.bind(this)}
						onList={this.onList.bind(this)}
						onError={this.onError.bind(this)} 
						api={this.api}
					/>

					<Sidebar 
						open={this.state.sidebarOpen}
						onSidebar={this.onSidebar.bind(this)} 
						onList={this.onList.bind(this)}
						onError={this.onError.bind(this)} 
						api={this.api}
					/>

					<List 
						ref={this.list}
						onError={this.onError.bind(this)} 
						api={this.api}
					/>

					<Alert
						title={this.state.reason}
						open={this.state.error} 
						onAccept={this.hideError.bind(this)}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default ChipDrive;