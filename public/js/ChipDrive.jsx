import React, { useEffect, useReducer } from 'react';

import Login from './Component/Login.jsx';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import Body from './Component/Body.jsx';
import Alert from './Component/Alert.jsx';
import TaskModal from './Component/TaskModal.jsx';

import ChipDriveContext from './Context/ChipDriveContext.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

const reducer = (state, action) => {
	console.log(state, action);
	switch (action.type) {
		case 'filter': {
			return {
				...state, 
				filter: action.filter,
			};
		}
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
		case 'login': {
			return { 
				...state, 
				login: true
			};
		}
		case 'closeLogin': {
			return { 
				...state, 
				login: false
			};
		}
		default: {
			return state;
		}
	}
};

function ChipDrive(props) {
	var [{
		filter,
		sidebar, 
		drive, 
		folder, 
		tasks,
		login,

		alert,
		alertTitle
	}, dispatch] = useReducer(reducer, {
		filter: "",
		sidebar: false,
		drive: "Unknown",
		folder: "root",
		tasks: {},
		login: false,

		alert: false,
		alertTitle: ""
	});

	useEffect(() => {
		console.log(`%cChip%cDrive %cClient`, 'color: #43833a; font-size: 30px;', 'color: #a5a5a5; font-size: 30px;', 'color: #4d4d4d; font-size: 30px;');
	}, []);

	return (
		<ChipDriveContext.Provider value={dispatch}>
			{ 
				!login && 
				<div className={cssf(css, "!chipdrive-app chipdrive")}>
					<Header 
						folder={folder}
					/>

					<Sidebar 
						open={sidebar} 
						folder={folder}
					/>

					<Body 
						title={drive} 
						folder={folder}
						filter={filter} 
					/>

					<TaskModal 
						tasks={tasks}
						onClear={() => {
							dispatch({
								type: "closeTask"
							})
						}}
					/>

					<Alert
						title={alertTitle}
						open={alert} 
						onAccept={() => {
							dispatch({
								type: "unalert"
							});
						}}
					/>
				</div>
			}

			{ login && <Login /> }
		</ChipDriveContext.Provider>
	);
}

export default ChipDrive;