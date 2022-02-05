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
		var {tasks} = this.props;
		if(Object.keys(tasks).length > 0) {
			var task = Object.values(tasks)[Object.keys(tasks).length - 1];
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
						<p className={cssf(css, "task-name text m-0")}>{task.name}</p>
						<div className={cssf(css, "flex-fill")}></div>
						{
							task.progress < 100.0
							?
							(
								<img src="./img/loader.svg" className={cssf(css, "task-spinner")}/>
							)
							:
							(
								<i className={cssf(css, "!fas !fa-check-circle task-success")}></i>
							)
						}
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