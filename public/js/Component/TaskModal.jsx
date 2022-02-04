import React from 'react';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class TaskModal extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		
	}
	renderList() {
		var list = [];

		for(var [id, task] of Object.entries(this.props.tasks).reverse()) {
			list.push(
				<div className={cssf(css, "task-item")}>
					<p className={cssf(css, "item-name text m-0")}>{task.name}</p>
					<div className={cssf(css, "flex-fill")}></div>
					{/*<p className={cssf(css, "item-progress text m-0")}>{task.progress}%</p>*/}
					{
						task.progress < 100.0
						?
						(
							<img src="./img/loader.svg" className={cssf(css, "item-spinner")}/>
						)
						:
						(
							<i className={cssf(css, "!fas !fa-check-circle item-success")}></i>
						)
					}
				</div>
			);
		}

		if(list.length > 0) {
			return (
				<div className={cssf(css, "task-modal")}>
					<div className={cssf(css, "task-modal-header")}>
						<p className={cssf(css, "header-text text m-0")}>
							Ongoing Tasks
						</p>
						<div className={cssf(css, "flex-fill")}></div>
						<i className={cssf(css, "!fas !fa-times-circle header-cross")} onClick={this.props.onClear}></i>
					</div>
					<div className={cssf(css, "task-modal-body")}>
						{list}
					</div>
				</div>
			);
		}

		return null;
	}
	render() {
		return this.renderList();
	}
}

export default TaskModal;