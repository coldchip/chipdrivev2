import React from 'react';

import Loader from './Loader.jsx';
import Item from './Item.jsx';

class List extends React.Component {
	constructor() {
		super();
		this.state = { 
			list: [],
			loading: false
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
			loading: true
		});

		api.list().then((list) => {
			this.setState({
				list: list,
				loading: false
			});
		}).catch((e) => {
			this.setState({
				list: [],
				loading: false
			});
			alert(e);
		});
	}
	renderList() {
		var list = [];
		this.state.list.forEach((item) => {
			list.push(
				<Item 
					item={item} 
					onEnter={this.list.bind(this)}
					relist={this.list.bind(this)}
					api={this.props.api}
				/>
			);
		});

		return list;
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
					<div className="list-container">
					{
						this.state.list.length > 0 ?
						(
							this.renderList()
						)
						:
						(
							<h1 class="text">Empty Folder</h1>
						)
					}
					</div>
					{
						this.state.loading ? 
						(
							<Loader />
						) 
						: null
					}
				</div>
			</React.Fragment>
		);
	}
}

export default List;