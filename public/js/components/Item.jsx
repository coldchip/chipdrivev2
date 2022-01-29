import React from 'react';
import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';

class Item extends React.Component {
	constructor(props) {
		super();
		this.state = {
            popupOpen: false
        };
	}
	onEnter() {
		this.props.api.setFolder(this.props.item.id);
		this.props.onEnter();
	}
	render() {
		if(this.props.item.type == 1) {
			return (
				<ItemViewer trigger={
					<div className="list-item">
						<ItemOption trigger={
							<i class="fas fa-chevron-circle-down item-option-icon"></i>
						} item={this.props.item} relist={this.props.relist} api={this.props.api} />
						
						<i class="fas fa-file item-icon"></i>
						<p className="item-label text">{this.props.item.name}</p>
					</div>
				} item={this.props.item} api={this.props.api} />
			)
		} else {
			return (
				<div className="list-item" onClick={this.onEnter.bind(this)}>
					<ItemOption trigger={
						<i class="fas fa-chevron-circle-down item-option-icon"></i>
					} item={this.props.item} relist={this.props.relist} api={this.props.api} />
					
					<i class="fas fa-folder item-icon"></i>
					<p className="item-label text">{this.props.item.name}</p>
				</div>
			)
		}
	}
}

export default Item;
