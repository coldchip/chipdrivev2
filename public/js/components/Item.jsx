import React from 'react';
import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";

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
				
				<div className={`${css["list-item"]}`}>
					<ItemOption 
						trigger={
							<i className={`fas fa-chevron-circle-down ${css["item-option-icon"]}`}></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<ItemViewer 
						trigger={
							<div className={`${css["list-item-inner"]}`}>
								<i className={`fas fa-file ${css["item-icon"]}`}></i>
								<p className={`${css["item-label"]} ${css["text"]}`}>{this.props.item.name}</p>
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
				<div className={`${css["list-item"]}`}>
					<ItemOption 
						trigger={
							<i className={`fas fa-chevron-circle-down ${css["item-option-icon"]}`}></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<div className={`${css["list-item-inner"]}`} onClick={this.onEnter.bind(this)}>
						<i className={`fas fa-folder ${css["item-icon"]}`}></i>
						<p className={`${css["item-label"]} ${css["text"]}`}>{this.props.item.name}</p>
					</div>
				</div>
			)
		}
	}
}

export default Item;
