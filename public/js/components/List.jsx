import React from 'react';

import Item from './Item.jsx';

class FileView extends React.Component {
	constructor() {
		super();
		this.state = { 
			list: [] 
		};
	}
	componentDidMount() {
		var api = this.props.api;
		api.setFolder("root");
		this.list();
	}
	list() {
		var api = this.props.api;

		api.list().then((list) => {
			this.setState({
				list: list
			});
		}).catch(() => {

		});
	}
	render() {
		return (
			<React.Fragment>
				<div className="label">
					<p className="label-text text">
						<i className="fas fa-file label-icon me-2"></i>
						Files
					</p>
					<i className="fas fa-sort-alpha-up label-sort-icon"></i>
				</div>
				<div className="list-container">
				{
					this.state.list.map((object) => {
						return (
							<Item 
								object={object} 
								onEnter={this.list.bind(this)}
							/>
						)
					})
				}
				</div>
			</React.Fragment>
		);
	}
}

export default FileView;