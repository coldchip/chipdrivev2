import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class Folder extends React.Component {
	constructor(props) {
		super();
		this.state = {
            popupOpen: false
        };
	}
	render() {
		return (
			<React.Fragment>
				<div className="list-item" onClick={() => {
					this.setState({popupOpen: !this.state.popupOpen});
				}}>
					<i class="fas fa-chevron-circle-down item-option-icon"></i>
					<i class="fas fa-folder item-icon"></i>
					<p className="item-label text">{this.props.object.name}</p>
				</div>

				<Popup open={this.state.popupOpen} onClose={() => {
					this.setState({popupOpen: !this.state.popupOpen});
				}} closeOnDocumentClick>
					<div className="modal">
						<a className="close">
						&times;
						</a>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae magni
						omnis delectus nemo, maxime molestiae dolorem numquam mollitia, voluptate
						ea, accusamus excepturi deleniti ratione sapiente! Laudantium, aperiam
						doloribus. Odit, aut.
					</div>
				</Popup>

			</React.Fragment>
		);
	}
}

export default Folder;
