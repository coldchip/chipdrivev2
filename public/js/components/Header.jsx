import React from 'react';

class Header extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<React.Fragment>
				<div className="chipdrive-header">
					<svg onClick={this.props.toggleSidebar} xmlns="http://www.w3.org/2000/svg" className="header-bars" height="384pt" viewBox="0 -53 384 384" width="384pt">
						<path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
						<path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
						<path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
					</svg>
					<a href="#">
						<img className="header-logo" src="./img/logo.png" alt="ChipDrive Logo" />	
					</a>
					<div className="flex-fill"></div>
					<button className="header-upload text" id="new_btn">
						<i className="fas fa-plus me-2"></i>
						New
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default Header;