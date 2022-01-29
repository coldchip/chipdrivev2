import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createRef } from 'react';

import API from './API.js';

import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import List from './components/List.jsx';

import "bootstrap"; 
import "bootstrap/dist/css/bootstrap.css";
import "../css/index.scss";

class ChipDrive extends React.Component {
	constructor() {
		super();
		this.list = createRef();

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
				<div className="chipdrive">
					<Header 
						toggleSidebar={() => {
							this.setState({sidebarOpen: !this.state.sidebarOpen});
						}}
						relist={() => {this.list.current.list()}}
						api={this.api}
					/>

					<Sidebar 
						toggleSidebar={() => {
							this.setState({sidebarOpen: !this.state.sidebarOpen});
						}} 
						open={this.state.sidebarOpen}
						relist={() => {this.list.current.list()}}
						api={this.api}
					/>

					<List 
						api={this.api}
						ref={this.list}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default ChipDrive;