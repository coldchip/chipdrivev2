import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import API from './chipdriveapi.js';

import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import List from './components/List.jsx';

import "bootstrap"; 
import "bootstrap/dist/css/bootstrap.css";
import "../css/index.scss";

class ChipDrive extends React.Component {
	constructor() {
		super();
		this.state = {
            sidebarOpen: false
        };
		this.api = new API();
		this.api.setEndpoint("http://localhost:8193");
	}
	
	componentDidMount() {
		
	}

	render() {
		return ( 
			<React.Fragment>
				<Header 
					toggleSidebar={() => {
						this.setState({sidebarOpen: !this.state.sidebarOpen});
					}} 
				/>

				<Sidebar 
					toggleSidebar={() => {
						this.setState({sidebarOpen: !this.state.sidebarOpen});
					}} 
					open={this.state.sidebarOpen}
					api={this.api}
				/>

				<div className="chipdrive-body">
					<List api={this.api} />
				</div>
			</React.Fragment>
		);
	}
}

export default ChipDrive;