import React from 'react';
import { createRef } from 'react';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class Prompt extends React.Component {
	constructor(props) {
		super(props);
		this.modal = createRef();

		this.state = { 
			input: ""
		};
	}
	componentDidMount() {
		if(typeof this.props.onRender === 'function') {
			this.props.onRender();
		}
	}
	onType(event) {
		this.setState({input: event.target.value});
	}
	onAccept() {
		this.modal.current.close();
		if(typeof this.props.onAccept === 'function') {
			this.props.onAccept(this.state.input);
		}
	}
	onReject() {
		this.modal.current.close();
		if(typeof this.props.onReject === 'function') {
			this.props.onReject();
		}
	}
	render() {
		return (
			<React.Fragment>
				<Popup 
					open={this.props.open} 
					trigger={this.props.trigger}
					onClose={this.props.onClose}
					closeOnDocumentClick={false}
					closeOnEscape={false}
					ref={this.modal}
					nested
					modal
				>
					<div className={cssf(css, "cd-modal")}>
						<div className={cssf(css, "cd-modal-header")}>
							<p className={cssf(css, "cd-modal-title text")}>{this.props.title}</p>
						</div>
						<div className={cssf(css, "cd-modal-body")}>
							<form className={cssf(css, "cd-modal-form")}>
								<input type="input" onChange={this.onType.bind(this)} className={cssf(css, "cd-modal-input text")} />
							</form>
						</div>
						<div className={cssf(css, "cd-modal-footer")}>
							<button className={cssf(css, "cd-modal-button text")} onClick={this.onReject.bind(this)}>CANCEL</button>
							<button className={cssf(css, "cd-modal-button text")} onClick={this.onAccept.bind(this)}>OK</button>
						</div>
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default Prompt;