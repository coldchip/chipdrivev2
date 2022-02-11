import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';

import API from './API.js';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import Body from './Component/Body.jsx';
import Alert from './Component/Alert.jsx';
import Prompt from './Component/Prompt.jsx';
import TaskModal from './Component/TaskModal.jsx';

import APIContext from './Context/APIContext.jsx';
import ChipDriveContext from './Context/ChipDriveContext.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

const reducer = (state, action) => {
	console.log(state, action);
	switch (action.type) {
		case 'alert': {
			return {
				...state, 
				alert: true,
				alertTitle: action.title
			};
		}
		case 'unalert': {
			return {
				...state, 
				alert: false,
				alertTitle: ""
			};
		}
		case 'sidebar': {
			return {
				...state, 
				sidebar: !state.sidebar 
			};
		}
		case 'drive': {
			return { 
				...state, 
				drive: action.name
			};
		}
		case 'list': {
			/* 
				React listen for state changes based on their refrence
				using new String will create a mutable string
			*/
			return { 
				...state, 
				folder: action.id ? new String(action.id) : new String(state.folder)
			};
		}
		case 'task': {
			return { 
				...state, 
				tasks: {
					...state.tasks, 
					[action.id]: action.task 
				}
			};
		}
		case 'closeTask': {
			return { 
				...state, 
				tasks: {}
			};
		}
		default: {
			return state;
		}
	}
};

function ChipDrive(props) {
	var api = React.useMemo(() => {
		console.log(`%cChip%cDrive %cClient`, 'color: #43833a; font-size: 30px;', 'color: #a5a5a5; font-size: 30px;', 'color: #4d4d4d; font-size: 30px;');
		console.log(`%cChipDrive • Warning:%c Unless you are a developer, please do not type or insert anything here if someone asks you to do it. It might be malicious. Your data may be compromised if you do so. `, 'color: #FFFFFF; background: red;', '');

		var api = new API();
		api.setEndpoint(props.endpoint);
		api.setToken(props.token);

		return api;
	}, [props.endpoint, props.token]);

	var [{
			sidebar, 
			drive, 
			folder, 
			tasks, 

			alert,
			alertTitle
		}, dispatch] = useReducer(reducer, {
		sidebar: false,
		drive: "Unknown",
		folder: "root",
		tasks: {},

		alert: false,
		alertTitle: ""
	});

	var app = (
		<div className={cssf(css, "!chipdrive-app chipdrive")}>
			<Header />

			<Sidebar 
				open={sidebar} 
			/>

			<Body 
				title={drive} 
				folder={folder} 
			/>

			<TaskModal 
				tasks={tasks}
				onClear={() => {
					dispatch({type: "closeTask"})
				}}
			/>

			<Alert
				title={alertTitle}
				open={alert} 
				onAccept={() => {
					dispatch({type: "unalert"});
				}}
			/>
		</div>
	);

	return (
		<APIContext.Provider value={api}>
			<ChipDriveContext.Provider value={dispatch}>
				{app}
			</ChipDriveContext.Provider>
		</APIContext.Provider>
	);
}

export default ChipDrive;