import React, { useContext, useState, useEffect } from 'react';

import APIContext from './../Context/APIContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import NewItem from './NewItem.jsx';
import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function DriveList(props) {
	var api = useContext(APIContext);
	var dispatch = useContext(ChipDriveContext);

	var [list, setList] = useState([]);
	var [loading, setLoading] = useState(false);

	useEffect(() => {
		setList([]);
		setLoading(true);

		api.getDriveList().then((list) => {
			setList(list);
			setLoading(false);

			if(list.length > 0) {
				var drive = list[0];
				dispatch({type: "drive", name: drive.name});
				dispatch({type: "list", id: drive.id});
			}
		}).catch((e) => {
			dispatch({type: "alert", title: e});
		});
	}, [api, dispatch]);

	function renderDriveList() {
		if(!loading) {
			return (
				<div className={cssf(css, "drive-list")}>
					{
						list.map((drive) => {
							return (
								<button 
									className={cssf(css, "sidebar-item text")}
									onClick={() => {
										dispatch({type: "drive", name: drive.name});
										dispatch({type: "list", id: drive.id});
									}} 
									tabIndex="0"
									key={drive.id}
								>
									<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
									{drive.name}
								</button>
							);
						})
					}
				</div>
			);
		} else {
			return (
				<Loader />
			);
		}
	}
}

export default React.memo(DriveList);