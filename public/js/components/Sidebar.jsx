import React from 'react';
import NewItem from './NewItem.jsx';
import Loader from './Loader.jsx';
import css from "../../css/index.scss";

class Sidebar extends React.Component {
	constructor() {
		super();
		this.state = { 
			list: [],
			loading: false,
			error: false,
			reason: ""
		};
	}
	componentDidMount() {
		this.getDrives();
	}
	getDrives() {
		var api = this.props.api;

		this.setState({
			list: [],
			loading: true,
			error: false,
			reason: ""
		});
		api.getDriveList().then((list) => {
			this.setState({
				list: list,
				loading: false,
				error: false,
				reason: ""
			});
		}).catch((e) => {
			this.setState({
				list: [],
				loading: false,
				error: true,
				reason: e
			});
		});
	}
	renderDriveList() {
		var list = [];
		this.state.list.forEach((drive) => {
			list.push(
				<button 
					className={`${css["sidebar-item"]} ${css["text"]}`}
					onClick={
						() => {
							this.props.api.setFolder(drive.id);
							this.props.onList();
						}
					} 
					tabindex="0"
				>
					<i className={`far fa-hdd ${css["me-2"]}`}></i>
					{drive.name}
				</button>
			);
		});

		if(!this.state.error) {
			if(!this.state.loading) {
				return (
					<div className={`${css["drive-list"]}`}>
						{list}
					</div>
				);
			} else {
				return (
					<Loader />
				);
			}
		} else {
			return (
				<div className={`${css["mt-2"]} ${css["notice-container"]}`}>
					<p className={`${css["notice-text"]} ${css["text"]}`}>{this.state.reason}</p>
					<i className={`fas fa-exclamation-circle ${css["notice-icon"]}`}></i>	
				</div>
			);
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className={`${css["chipdrive-sidebar"]} ${!this.props.open ? css["chipdrive-sidebar-hidden"] : ""} ${css["pt-3"]}`}>
					<div className={`${css["text"]} ${css["sidebar-close"]}`}>
						<i className={`${css["fas"]} ${css["fa-times"]} ${css["cross"]}`} onClick={this.props.onSidebar}></i>
					</div>

					<NewItem 
						trigger={
							<button className={`${css["sidebar-upload"]} ${css["text"]} ${css["mb-3"]}`} tabindex="0">
								<i className={`fas fa-plus ${css["cross"]} ${css["me-2"]}`}></i>
								New
							</button>
						} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					{ this.renderDriveList() }

					<div className={`${css["sidebar-seperator"]}`}></div>
					<button className={`${css["sidebar-item"]} ${css["text"]}`} tabindex="0" id="cd_sb_5">
						<i className={`fas fa-cog ${css["me-2"]}`}></i>
						Settings
					</button>
					<button className={`${css["sidebar-item"]} ${css["text"]}`} tabindex="0" id="cd_sb_6">
						<i className={`fas fa-info-circle ${css["me-2"]}`}></i>
						About
					</button>
					<button className={`${css["sidebar-item"]} ${css["text"]}`} tabindex="0" id="cd_sb_7">
						<i className={`fas fa-sign-out-alt ${css["me-2"]}`}></i>
						Logout
					</button>
					<div className={`${css["sidebar-seperator"]}`}></div>
					<div className={`${css["sidebar-quota"]} ${css["pt-3"]} ${css["pb-3"]}`} tabindex="0">
						<div className={`${css["quota-header"]} ${css["text"]}`}>
							<i className={`fas fa-hdd ${css["me-2"]}`}></i>
							My Storage
						</div>
						<div className={`${css["quota-bar"]} ${css["mt-3"]}`}>
							<div className={`${css["quota-bar-used"]}`}></div>
						</div>
						<div className={`${css["quota-usage"]} ${css["text"]} ${css["mt-2"]}`}>
							0.0 B of 0 B used
						</div>
						<div className={`${css["quota-warning"]} ${css["text"]} ${css["mt-2"]}`}>
							<i className={`fas fa-info-circle ${css["me-2"]}`}></i>
							Quota almost full
						</div>
					</div>
					<div className={`${css["sidebar-seperator"]}`}></div>
				</div>
				{
					this.props.open ? (
						<div className={`${css["chipdrive-sidebar-backdrop"]}`} onClick={this.props.onSidebar}></div>
					) : null
				}
			</React.Fragment>
		);
	}
}

export default Sidebar;