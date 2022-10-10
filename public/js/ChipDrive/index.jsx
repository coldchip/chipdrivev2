import React, { useEffect, useReducer, useState } from 'react';

import DriveHeader from './components/DriveHeader.jsx';
import DriveSidebar from './components/DriveSidebar.jsx';
import DriveBody from './components/DriveBody.jsx';
import TaskModal from './components/TaskModal.jsx';

import ItemDragLayer from './components/ItemDragLayer.jsx'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import TokenContext from './contexts/TokenContext.jsx';
import ChipDriveContext from './contexts/ChipDriveContext.jsx';

import css from "./style/index.scss";
import cssf from "./../CSSFormat";

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

	useEffect(() => {
		document.title = "ChipDrive - My Drive";
	}, []);

	useEffect(() => {
		if(login === true) {
			window.location.href = "/login";
		}
	}, [login]);

	let token = localStorage.getItem("token");

	return (
		<TokenContext.Provider value={token}>
			<ChipDriveContext.Provider value={dispatch}>
				<DndProvider backend={HTML5Backend}>
					<div className={cssf(css, "!chipdrive-app chipdrive")}>
						<ItemDragLayer />

						<DriveHeader 
							folder={folder}
						/>

						<DriveSidebar 
							open={sidebar} 
							folder={folder}
						/>

						<DriveBody 
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
				</DndProvider>
			</ChipDriveContext.Provider>
		</TokenContext.Provider>
	);
}

export default ChipDrive;