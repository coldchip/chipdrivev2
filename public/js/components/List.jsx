import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';

import fetch from './../IO.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function List(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	const selectable = useRef(null);
	const [select, setSelect] = useState(false);
	const [selectStartX, setSelectStartX] = useState(0);
	const [selectStartY, setSelectStartY] = useState(0);
	const [selectX, setSelectX] = useState(0);
	const [selectY, setSelectY] = useState(0);
	const [selectWidth, setSelectWidth] = useState(0);
	const [selectHeight, setSelectHeight] = useState(0);

	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(undefined);

	useEffect(() => {
		setList([]);
		setLoading(true);
		setError(undefined);

		fetch(`/api/v2/drive/list/${props.folder}`, {
			method: "GET",
			query: {
				filter: props.filter
			},
			headers: {
				token: token
			}
		}).then((response) => {
			var {status, body} = response;

			setList(body);
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				dispatch({
					type: "login"
				});
			} else {
				setError(body.message);
			}
		}).finally(() => {
			setLoading(false);
		});

	}, [dispatch, props.folder, props.filter, token]);

	var onMouseDown = (e) => {
		if(selectable.current === e.target) {
			var x = e.pageX;
			var y = e.pageY;

			setSelect(true);
			setSelectX(x);
			setSelectY(y);
			setSelectStartX(x);
			setSelectStartY(y);
			setSelectWidth(0);
			setSelectHeight(0);
		}
	};

	var onMouseMove = (e) => {
		var x = e.pageX;
		var y = e.pageY;

		var width = x - selectStartX;
		var height = y - selectStartY;

		if(width < 0) {
			setSelectX(x);
		}

		if(height < 0) {
			setSelectY(y);
		}

		setSelectWidth(Math.abs(width));
		setSelectHeight(Math.abs(height));
	};

	var onMouseUp = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setSelect(false);
	};


	if(!error) {
		if(!loading) {
			if(list.length > 0) {
				return (
					<div 
						className={cssf(css, "list-container")} 
						onMouseDown={onMouseDown} 
						onMouseMove={onMouseMove} 
						onMouseUp={onMouseUp}
						ref={selectable}
					>
						{
							select &&
							<div 
								className={cssf(css, "select-box")}
								style={{
									top: selectY, 
									left: selectX,
									width: selectWidth, 
									height: selectHeight
								}}
							></div>
						}
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
	} else {
		return (
			<h1 className={cssf(css, "text mt-5")}>Error: {error}</h1>
		);
	}
}

export default React.memo(List);