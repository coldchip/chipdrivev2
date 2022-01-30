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
		this.props.onList();
	}
	render() {
		if(this.props.item.type == 1) {
			return (
				
				<div className="list-item">
					<ItemOption 
						trigger={
							<i class="fas fa-chevron-circle-down item-option-icon"></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<ItemViewer 
						trigger={
							<div className="list-item-inner">
								<i class="fas fa-file item-icon"></i>
								<p className="item-label text">{this.props.item.name}</p>
							</div>
						} 
						item={this.props.item} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>
				</div>
				
			)
		} else {
			return (
				<div className="list-item">
					<ItemOption 
						trigger={
							<i class="fas fa-chevron-circle-down item-option-icon"></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<div className="list-item-inner" onClick={this.onEnter.bind(this)}>
						<i class="fas fa-folder item-icon"></i>
						<p className="item-label text">{this.props.item.name}</p>
					</div>
				</div>
			)
		}
	}
}

export default Item;
