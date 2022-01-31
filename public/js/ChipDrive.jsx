import React, { createRef } from 'react';
import ReactDOM from 'react-dom';

import API from './API.js';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import List from './Component/List.jsx';
import Alert from './Component/Alert.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

class ChipDrive extends React.Component {
	constructor(props) {
		super(props);
		this.listref = createRef();

		this.state = {
            sidebarOpen: false,
            currentDriveName: "Unknown",
            error: false,
            reason: ""
        };
		this.api = new API();
		this.api.setEndpoint(this.props.endpoint);
		this.api.setToken(this.props.token);
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

	onSetDrive(name) {
		this.setState({
            currentDriveName: name
        });
	}

	onSidebar() {
		this.setState({sidebarOpen: !this.state.sidebarOpen});
	}

	onList() {
		this.listref.current.onList();
	}

	render() {
		return ( 
			<div className={cssf(css, "!chipdrive-app chipdrive")}>
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
					onSetDrive={this.onSetDrive.bind(this)}
					onError={this.onError.bind(this)} 
					api={this.api}
				/>

				<List 
					title={this.state.currentDriveName}
					ref={this.listref}
					onError={this.onError.bind(this)} 
					api={this.api}
				/>

				<Alert
					title={this.state.reason}
					open={this.state.error} 
					onAccept={this.hideError.bind(this)}
				/>
			</div>
		);
	}
}

export default ChipDrive;