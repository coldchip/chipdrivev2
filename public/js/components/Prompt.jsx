import React from 'react';
import Types from '../Types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class Prompt extends React.Component {
	constructor() {
		super();
		this.state = { 
			closeModal: false
		};
	}
	renderView() {
		
	}
	render() {
		return (
			<React.Fragment>
				<Popup 
					trigger={this.props.trigger} 
					open={this.props.open} 
					onClose={this.state.closeModal} 
					closeOnDocumentClick={false}
					closeOnEscape={false}
					modal
				>
					<div class="cd-modal">
						<div class="cd-modal-header">
							<p class="cd-modal-title text">Rename it</p>
						</div>
						<div class="cd-modal-body">
							<form class="cd-modal-form">
								<input type="input" class="cd-modal-input text" />
							</form>
						</div>
						<div class="cd-modal-footer">
							<button class="cd-modal-button text" onClick={() => {
								this.setState({
									closeModal: true
								})
							}}>CANCEL</button>
							<button class="cd-modal-button text">OK</button>
						</div>
					</div>
				</Popup>
			</React.Fragment>
		);
	}
}

export default Prompt;