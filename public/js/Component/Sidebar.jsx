import React from 'react';
import NewItem from './NewItem.jsx';
import Loader from './Loader.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			list: [],
			loading: true,
			error: false,
			reason: ""
		};
	}
	componentDidMount() {
		this.getDrives();
	}
	onSetDrive(drive) {
		this.props.api.setFolder(drive.id);
		this.props.onSetDrive(drive.name);
		this.props.onList();
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

			if(list.length > 0) {
				var drive = list[0];
				this.onSetDrive(drive);
			}
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
					className={cssf(css, "sidebar-item text")}
					onClick={() => { this.onSetDrive(drive); }} 
					tabIndex="0"
					key={drive.id}
				>
					<i className={cssf(css, "!fas !fa-hdd me-2")}></i>
					{drive.name}
				</button>
			);
		});

		if(!this.state.error) {
			if(!this.state.loading) {
				return (
					<div className={cssf(css, "drive-list")}>
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
				<div className={cssf(css, "notice-container mt-2")}>
					<p className={cssf(css, "notice-text text")}>{this.state.reason}</p>
					<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon")}></i>	
				</div>
			);
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className={cssf(css, `chipdrive-sidebar ${!this.props.open ? `chipdrive-sidebar-hidden` : ""} pt-3`)}>
					<div className={cssf(css, "text sidebar-close")}>
						<i className={cssf(css, "!fas !fa-times cross")} onClick={this.props.onSidebar}></i>
					</div>

					<NewItem 
						trigger={
							<button className={cssf(css, "sidebar-upload text mb-3")} tabIndex="0">
								<i className={cssf(css, "!fas !fa-plus cross me-2")} ></i>
								New
							</button>
						} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					{ this.renderDriveList() }

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
					this.props.open ? (
						<div className={cssf(css, "chipdrive-sidebar-backdrop")} onClick={this.props.onSidebar}></div>
					) : null
				}
			</React.Fragment>
		);
	}
}

export default Sidebar;