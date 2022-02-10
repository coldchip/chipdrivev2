import React, {useContext, useState, useEffect} from 'react';

import APIContext from './../Context/APIContext.jsx';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var api = useContext(APIContext);
	var dispatch = useContext(ChipDriveContext);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		setList([]);

		api.setFolder(props.folder);
		api.list().then((_list) => {
			setLoading(false);
			setList(_list);
		}).catch((e) => {
			dispatch({type: "error", reason: e});
		});
	}, [api, dispatch, props.folder]);

	if(!loading) {
		if(list.length > 0) {
			return (
				<div className={cssf(css, "list-container")}>
					{
						list.map((item) => {
							return (
								<Item 
									item={item} 
									key={item.id}
								/>
							);
						})
					}
				</div>
			);
		} else {
			return (
				<div className={cssf(css, "notice-container mt-2")}>
					<p className={cssf(css, "notice-text text")}>This Folder is Empty</p>
					<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon")}></i>	
				</div>
			);
		}
	} else {
		return (
			<Loader />
		);
	}
}

export default React.memo(List);