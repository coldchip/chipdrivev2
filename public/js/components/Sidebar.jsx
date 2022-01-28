import React from 'react';

class Sidebar extends React.Component {
	constructor() {
		super();
		this.state = { 
			list: [] 
		};
	}
	componentDidMount() {
		this.getDrives();
	}
	getDrives() {
		var api = this.props.api;
		api.getDriveList().then((list) => {
			this.setState({
				list: list
			});
		}).catch(() => {

		});
	}
	render() {
		return (
			<React.Fragment>
				<div className={`chipdrive-sidebar ${!this.props.open ? "chipdrive-sidebar-hidden" : ""} pt-3`}>
					<div className="text sidebar-close">
						<i className="fas fa-times cross" onClick={this.props.toggleSidebar}></i>
					</div>
					<button className="sidebar-upload text mb-3" tabindex="0">
						<i className="fas fa-plus cross me-2"></i>
						New

					</button>
					<div className="drive-list">
					{
						this.state.list.map((item) => {
							return (
								<button class="sidebar-item text" tabindex="0">
									<i class="far fa-hdd me-2"></i>
									{item.name}
								</button>
							)
						})
					}
					</div>
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
						<div className="chipdrive-sidebar-backdrop" onClick={this.props.toggleSidebar}></div>
					) : null
				}
			</React.Fragment>
		);
	}
}

export default Sidebar;