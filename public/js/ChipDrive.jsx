import React, { useEffect, useReducer, useState } from 'react';

import Header from './Component/Header.jsx';
import Sidebar from './Component/Sidebar.jsx';
import Body from './Component/Body.jsx';
import Alert from './Component/Alert.jsx';
import TaskModal from './Component/TaskModal.jsx';

import TokenContext from './Context/TokenContext.jsx';
import ChipDriveContext from './Context/ChipDriveContext.jsx';

import css from "../css/index.scss";
import cssf from "./CSSFormat";

function getQuery(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const reducer = (state, action) => {
	console.log(state, action);
	switch (action.type) {
		case 'filter': {
			return {
				...state, 
				filter: action.filter,
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
				root: action.id
			};
		}
		case 'list': {
			let id = action.id ? action.id : state.folder

			return { 
				...state, 
				folder: new String(id),
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
		default: {
			return state;
		}
	}
};

function ChipDrive(props) {
	const [{
		filter,
		sidebar, 
		root,
		folder, 
		tasks,
		login
	}, dispatch] = useReducer(reducer, {
		filter: "",
		sidebar: false,
		root: undefined,
		folder: undefined,
		tasks: {},
		login: false
	});

	useEffect(() => {
		console.log(`%cChip%cDrive %cClient`, 'color: #43833a; font-size: 30px;', 'color: #a5a5a5; font-size: 30px;', 'color: #4d4d4d; font-size: 30px;');
	}, []);

	let body = (
		<TokenContext.Provider value={getQuery("token")}>
			<ChipDriveContext.Provider value={dispatch}>
				<div className={cssf(css, "!chipdrive-app chipdrive")}>
					<Header 
						folder={folder}
					/>

					<Sidebar 
						open={sidebar} 
						folder={folder}
					/>

					<Body 
						folder={folder}
						root={root}
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
				</div>
			</ChipDriveContext.Provider>
		</TokenContext.Provider>
	);


	if(!login) {
		return body;
	} else {
		return (
			<>
				<h1 className={cssf(css, "text")}>Please Log In</h1>
				<form>
					<input type="text" placeholder="Username" />
					<br />
					<input type="password" placeholder="Password" />
					<br />
					<button type="button">Login</button>
				</form>
			</>
		);
	}
}

export default ChipDrive;