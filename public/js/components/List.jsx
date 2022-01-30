import React from 'react';

import Loader from './Loader.jsx';
import Item from './Item.jsx';

class List extends React.Component {
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
		var api = this.props.api;
		api.setFolder("root");
		this.list();
	}
	list() {
		var api = this.props.api;

		this.setState({ 
			list: [],
			loading: true,
			error: false,
			reason: ""
		});

		api.list().then((list) => {
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
	renderList() {
		var list = [];
		this.state.list.forEach((item) => {
			list.push(
				<Item 
					item={item} 
					onList={this.list.bind(this)}
					onError={this.props.onError} 
					api={this.props.api}
				/>
			);
		});

		if(!this.state.error) {
			if(!this.state.loading) {
				if(list.length > 0) {
					return (
						<div className="list-container">
							{list}
						</div>
					);
				} else {
					return (
						<div className="mt-2 notice-container">
							<p className="notice-text text">This Folder is Empty</p>
							<i className="fab fa-dropbox notice-icon"></i>
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
				<div className="chipdrive-body">
					<div className="label">
						<p className="label-text text">
							<i className="fas fa-file label-icon me-2"></i>
							Files
						</p>
						<i className="fas fa-sort-alpha-up label-sort-icon"></i>
					</div>
					{ this.renderList() }
				</div>
			</React.Fragment>
		);
	}
}

export default List;