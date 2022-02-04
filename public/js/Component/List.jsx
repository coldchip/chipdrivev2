import React from 'react';

import Loader from './Loader.jsx';
import Item from './Item.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			list: [],
			loading: true
		};
	}
	componentDidMount() {
		
	}
	onList() {
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
			this.props.onError(e);
		});
	}
	renderList() {
		var list = [];
		this.state.list.forEach((item) => {
			list.push(
				<Item 
					item={item} 
					onList={this.onList.bind(this)}
					onTask={this.props.onTask}
					onError={this.props.onError}
					key={item.id}
					api={this.props.api}
				/>
			);
		});

		if(!this.state.loading) {
			if(list.length > 0) {
				return (
					<div className={cssf(css, "list-container")}>
						{list}
					</div>
				);
			} else {
				return (
					<div className={cssf(css, "notice-container mt-2")}>
						<p className={cssf(css, "notice-text text")}>This Folder is Empty</p>
						<i className={cssf(css, "!fas !fa-exclamation-circle notice-icon")}></i>	
					</div>
				);
			}
		} else {
			return (
				<Loader />
			);
		}
	}
	render() {
		return (
			<React.Fragment>
				<div className={cssf(css, "chipdrive-body")}>
					<div className={cssf(css, "label")}>
						<p className={cssf(css, "label-text text")}>
							<i className={cssf(css, "!fas !fa-hdd label-icon me-3")}></i>
							{this.props.title}
						</p>
					</div>
					{ this.renderList() }
				</div>
			</React.Fragment>
		);
	}
}

export default List;