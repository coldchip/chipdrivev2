import React from 'react';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";

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
		this.onList();
	}
	onList() {
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
					onList={this.onList.bind(this)}
					onError={this.props.onError} 
					api={this.props.api}
				/>
			);
		});

		if(!this.state.error) {
			if(!this.state.loading) {
				if(list.length > 0) {
					return (
						<div className={`${css["list-container"]}`}>
							{list}
						</div>
					);
				} else {
					return (
						<div className={`${css["notice-container"]} ${css["mt-2"]}`}>
							<p className={`${css["notice-text"]} ${css["text"]}`}>This Folder is Empty</p>
							<i className={`fas fa-exclamation-circle ${css["notice-icon"]}`}></i>	
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
				<div className={`${css["notice-container"]} ${css["mt-2"]}`}>
					<p className={`${css["notice-text"]} ${css["text"]}`}>{this.state.reason}</p>
					<i className={`fas fa-exclamation-circle ${css["notice-icon"]}`}></i>	
				</div>
			);
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className={`${css["chipdrive-body"]}`}>
					<div className={`${css["label"]}`}>
						<p className={`${css["label-text"]} ${css["text"]}`}>
							<i className={`fas fa-file ${css["label-icon"]} ${css["me-2"]}`}></i>
							Files
						</p>
						<i className={`fas fa-sort-alpha-up ${css["label-sort-icon"]}`}></i>
					</div>
					{ this.renderList() }
				</div>
			</React.Fragment>
		);
	}
}

export default List;