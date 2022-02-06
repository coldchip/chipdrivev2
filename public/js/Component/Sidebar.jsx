import React, { useContext, useState, useEffect } from 'react';
import ChipDriveContext from './../Context/ChipDriveContext.jsx';

import NewItem from './NewItem.jsx';
import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function Sidebar(props) {
	var {api, onList, onTask, onError} = useContext(ChipDriveContext);

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
				onList(drive.id);
			}
		}).catch((e) => {
			setList([]);
			onError(e);
		});
	}, []);

	function renderDriveList() {
		if(!loading) {
			return (
				<div className={cssf(css, "drive-list")}>
					{
						list.map((drive) => {
							return (
								<button 
									className={cssf(css, "sidebar-item text")}
									onClick={() => { onList(drive.id) }} 
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

	return (
		<React.Fragment>
			<div className={cssf(css, `chipdrive-sidebar ${!props.open ? `chipdrive-sidebar-hidden` : ""} pt-3`)}>
				<div className={cssf(css, "text sidebar-close")}>
					<i className={cssf(css, "!fas !fa-times cross")} onClick={props.onSidebar}></i>
				</div>

				<NewItem 
					trigger={
						<button className={cssf(css, "sidebar-upload text mb-3")} tabIndex="0">
							<i className={cssf(css, "!fas !fa-plus cross me-2")} ></i>
							New
						</button>
					} 
				/>

				{ renderDriveList() }

				<div className={cssf(css, "sidebar-seperator")}></div>
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-cog me-2")}></i>
					Settings
				</button>
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-info-circle me-2")}></i>
					About
				</button>
				<button className={cssf(css, "sidebar-item text")} tabIndex="0">
					<i className={cssf(css, "!fas !fa-sign-out-alt me-2")}></i>
					Logout
				</button>
				<div className={cssf(css, "sidebar-seperator")}></div>
				<div className={cssf(css, "sidebar-quota pt-3 pb-3")} tabIndex="0">
					<div className={cssf(css, "quota-header text")}>
						<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
						My Storage
					</div>
					<div className={cssf(css, "quota-bar mt-3")}>
						<div className={cssf(css, "quota-bar-used")}></div>
					</div>
					<div className={cssf(css, "quota-usage text")}>
						0.0 B of 0 B used
					</div>
					<div className={cssf(css, "quota-warning text mt-2")}>
						<i className={cssf(css, "!fas !fa-info-circle me-2")}></i>
						Quota almost full
					</div>
				</div>
				<div className={cssf(css, "sidebar-seperator")}></div>
			</div>
			{
				props.open ? (
					<div className={cssf(css, "chipdrive-sidebar-backdrop")} onClick={props.onSidebar}></div>
				) : null
			}
		</React.Fragment>
	);
}

export default Sidebar;