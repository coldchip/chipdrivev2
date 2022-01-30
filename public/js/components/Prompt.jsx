import React from 'react';
import { createRef } from 'react';
import Popup from 'reactjs-popup';
import css from "../../css/index.scss";

class Prompt extends React.Component {
	constructor() {
		super();
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
					trigger={this.props.trigger} 
					closeOnDocumentClick={false}
					closeOnEscape={false}
					ref={this.modal}
					nested
					modal
				>
					<div className={`${css["cd-modal"]}`}>
						<div className={`${css["cd-modal-header"]}`}>
							<p className={`${css["cd-modal-title"]} ${css["text"]}`}>{this.props.title}</p>
						</div>
						<div className={`${css["cd-modal-body"]}`}>
							<form className={`${css["cd-modal-form"]}`}>
								<input type="input" onChange={this.onType.bind(this)} className={`${css["cd-modal-input"]} ${css["text"]}`} />
							</form>
						</div>
						<div className={`${css["cd-modal-footer"]}`}>
							<button className={`${css["cd-modal-button"]} ${css["text"]}`} onClick={this.onReject.bind(this)}>CANCEL</button>
							<button className={`${css["cd-modal-button"]} ${css["text"]}`} onClick={this.onAccept.bind(this)}>OK</button>
						</div>
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default Prompt;