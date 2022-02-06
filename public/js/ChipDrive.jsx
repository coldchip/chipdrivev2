import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import API from './API.js';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import List from './Component/List.jsx';
import Alert from './Component/Alert.jsx';
import TaskModal from './Component/TaskModal.jsx';

import ChipDriveContext from './Context/ChipDriveContext.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

var api = new API();

function ChipDrive(props) {

	var [sidebar, setSidebar] = useState(false);
	var [folderID, setFolderID] = useState("");
	var [tasks, setTasks] = useState({});
	var [error, setError] = useState(false);
	var [reason, setReason] = useState("");

	function onError(reason) {
		setError(true);
		setReason(reason);
	}

	function onTask(id, task) {
        setTasks((prev) => ({...prev, [id]: task }));
	}

	function onList(folderid) {
		setFolderID(folderid);
	}

	api.setEndpoint(props.endpoint);
	api.setToken(props.token);

	var context = {
		onList: onList,
		onTask: onTask,
		onError: onError,
		api: api
	};

	return ( 
		<ChipDriveContext.Provider value={context}>
			<div className={cssf(css, "!chipdrive-app chipdrive")}>
				<Header 
					onSidebar={()=> {setSidebar(!sidebar)}}
				/>

				<Sidebar 
					open={sidebar}
					onSidebar={()=> {setSidebar(!sidebar)}} 
				/>

				<div className={cssf(css, "chipdrive-body")}>
					<div className={cssf(css, "label")}>
						<p className={cssf(css, "label-text text")}>
							<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
							My Drive
						</p>
					</div>
					<List 
						folderid={folderID}
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
		</ChipDriveContext.Provider>
	);
}

export default ChipDrive;