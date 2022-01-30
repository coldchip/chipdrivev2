import React from 'react';
import NewItem from './NewItem.jsx';
import Loader from './Loader.jsx';

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
					className="sidebar-item text" 
					onClick={
						() => {
							this.props.api.setFolder(drive.id);
							this.props.onList();
						}
					} 
					tabindex="0"
				>
					<i className="far fa-hdd me-2"></i>
					{drive.name}
				</button>
			);
		});

		if(!this.state.error) {
			if(!this.state.loading) {
				return (
					<div className="drive-list">
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
				<div className="mt-2 notice-container">
					<p className="notice-text text">{this.state.reason}</p>
					<i className="fas fa-exclamation-circle notice-icon"></i>	
				</div>
			);
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className={`chipdrive-sidebar ${!this.props.open ? "chipdrive-sidebar-hidden" : ""} pt-3`}>
					<div className="text sidebar-close">
						<i className="fas fa-times cross" onClick={this.props.onSidebar}></i>
					</div>

					<NewItem 
						trigger={
							<button className="sidebar-upload text mb-3" tabindex="0">
								<i className="fas fa-plus cross me-2"></i>
								New
							</button>
						} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					{ this.renderDriveList() }

					<div className="sidebar-seperator"></div>
					<button className="sidebar-item text" tabindex="0" id="cd_sb_5">
						<i className="fas fa-cog me-2"></i>
						Settings
					</button>
					<button className="sidebar-item text" tabindex="0" id="cd_sb_6">
						<i className="fas fa-info-circle me-2"></i>
						About
					</button>
					<button className="sidebar-item text" tabindex="0" id="cd_sb_7">
						<i className="fas fa-sign-out-alt me-2"></i>
						Logout
					</button>
					<div className="sidebar-seperator"></div>
					<div className="sidebar-quota pt-3 pb-3" tabindex="0">
						<div className="quota-header text">
							<i className="fas fa-hdd me-2"></i>
							My Storage
						</div>
						<div className="quota-bar mt-3">
							<div className="quota-bar-used"></div>
						</div>
						<div className="quota-usage text mt-2">
							0.0 B of 0 B used
						</div>
						<div className="quota-warning text mt-2">
							<i className="fas fa-info-circle me-2"></i>
							Quota almost full
						</div>
					</div>
					<div className="sidebar-seperator"></div>
				</div>
				{
					this.props.open ? (
						<div className="chipdrive-sidebar-backdrop" onClick={this.props.onSidebar}></div>
					) : null
				}
			</React.Fragment>
		);
	}
}

export default Sidebar;