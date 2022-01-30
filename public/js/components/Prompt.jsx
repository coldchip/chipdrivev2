import React from 'react';
import { createRef } from 'react';
import Popup from 'reactjs-popup';

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
					<div class="cd-modal">
						<div class="cd-modal-header">
							<p class="cd-modal-title text">{this.props.title}</p>
						</div>
						<div class="cd-modal-body">
							<form class="cd-modal-form">
								<input type="input" onChange={this.onType.bind(this)} class="cd-modal-input text" />
							</form>
						</div>
						<div class="cd-modal-footer">
							<button class="cd-modal-button text" onClick={this.onReject.bind(this)}>CANCEL</button>
							<button class="cd-modal-button text" onClick={this.onAccept.bind(this)}>OK</button>
						</div>
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default Prompt;