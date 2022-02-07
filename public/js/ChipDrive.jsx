import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import API from './API.js';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import List from './Component/List.jsx';
import Alert from './Component/Alert.jsx';
import TaskModal from './Component/TaskModal.jsx';

import APIContext from './Context/APIContext.jsx';
import ErrorContext from './Context/ErrorContext.jsx';
import TaskContext from './Context/TaskContext.jsx';
import ReloadContext from './Context/ReloadContext.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

function ChipDrive(props) {
	var [sidebar, setSidebar] = useState(false);
	var [reload, setReload] = useState("");
	var [tasks, setTasks] = useState({});
	var [error, setError] = useState(false);
	var [reason, setReason] = useState("");

	var api = React.useMemo(() => {
		console.log(`%cChip%cDrive %cClient`, 'color: #43833a; font-size: 30px;', 'color: #a5a5a5; font-size: 30px;', 'color: #4d4d4d; font-size: 30px;');
		console.log(`%cChipDrive • Warning:%c Unless you are a developer, please do not type or insert anything here if someone asks you to do it. It might be malicious. Your data may be compromised if you do so. `, 'color: #FFFFFF; background: red;', '');

		var api = new API();
		api.setEndpoint(props.endpoint);
		api.setToken(props.token);
		api.setFolder("root");

		return api;
	}, [props.endpoint, props.token]);

	var onError = React.useCallback((reason) => {
		setError(true);
		setReason(reason);
	}, []);

	var onTask = React.useCallback((id, task) => {
        setTasks((prev) => ({...prev, [id]: task }));
	}, [])

	var onReload = React.useCallback(() => {
		setReload(Math.random());
	}, []);

	var onSidebar = React.useCallback(() => {
		setSidebar((state) => !state);
	}, []);

	var app = (
		<div className={cssf(css, "!chipdrive-app chipdrive")}>
			<Header 
				onSidebar={onSidebar}
			/>

			<Sidebar 
				open={sidebar}
				onSidebar={onSidebar} 
			/>

			<div className={cssf(css, "chipdrive-body")}>
				<div className={cssf(css, "label")}>
					<p className={cssf(css, "label-text text")}>
						<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
						My Drive
					</p>
				</div>
				<List 
					reload={reload}
				/>
			</div>

			<Alert
				title={reason}
				open={error} 
				onAccept={() => { setError(false) }}
			/>

			<TaskModal 
				tasks={tasks}
				onClear={() => { setTasks([]) }}
			/>
		</div>
	);


	return (
		<APIContext.Provider value={api}>
			<ErrorContext.Provider value={onError}>
				<TaskContext.Provider value={onTask}>
					<ReloadContext.Provider value={onReload}>
						{app}
					</ReloadContext.Provider>
				</TaskContext.Provider>
			</ErrorContext.Provider>
		</APIContext.Provider>
	);
}

export default ChipDrive;