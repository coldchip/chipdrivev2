import React, { createRef } from 'react';
import ReactDOM from 'react-dom';

import API from './API.js';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import List from './Component/List.jsx';
import Alert from './Component/Alert.jsx';
import TaskModal from './Component/TaskModal.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

class ChipDrive extends React.Component {
	constructor(props) {
		super(props);
		this.listref = createRef();

		this.state = {
            sidebarOpen: false,
            tasks: {},
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

	onTask(id, task) {
		var tasks = this.state.tasks;

		tasks[id] = task

		this.setState({
            tasks: tasks
        });
	}

	onClose(task) {
		this.setState({
            tasks: []
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
					onTask={this.onTask.bind(this)}
					onError={this.onError.bind(this)} 
					api={this.api}
				/>

				<Sidebar 
					open={this.state.sidebarOpen}
					onSidebar={this.onSidebar.bind(this)} 
					onList={this.onList.bind(this)}
					onSetDrive={this.onSetDrive.bind(this)}
					onTask={this.onTask.bind(this)}
					onError={this.onError.bind(this)} 
					api={this.api}
				/>

				<div className={cssf(css, "chipdrive-body")}>
					<div className={cssf(css, "label")}>
						<p className={cssf(css, "label-text text")}>
							<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
							{this.state.currentDriveName}
						</p>
					</div>
					<List 
						ref={this.listref}
						onTask={this.onTask.bind(this)}
						onError={this.onError.bind(this)} 
						api={this.api}
					/>
				</div>

				<Alert
					title={this.state.reason}
					open={this.state.error} 
					onAccept={this.hideError.bind(this)}
				/>

				<TaskModal 
					tasks={this.state.tasks}
					onClear={this.onClose.bind(this)}
				/>
			</div>
		);
	}
}

export default ChipDrive;