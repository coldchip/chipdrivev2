import React from 'react';
import ItemOption from './ItemOption.jsx';
import ItemViewer from './ItemViewer.jsx';
import css from "../../css/index.scss";
import cssf from "../CSSFormat";

class Item extends React.Component {
	constructor(props) {
		super(props);
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
				
				<div className={cssf(css, "list-item")}>
					<ItemOption 
						trigger={
							<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<ItemViewer 
						trigger={
							<div className={cssf(css, "list-item-inner")}>
								<i className={cssf(css, "!fas !fa-file item-icon")}></i>
								<p className={cssf(css, "item-label text")}>{this.props.item.name}</p>
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
				<div className={cssf(css, "list-item")}>
					<ItemOption 
						trigger={
							<i className={cssf(css, "!fas !fa-chevron-circle-down item-option-icon")}></i>
						} 
						item={this.props.item} 
						onList={this.props.onList} 
						onError={this.props.onError} 
						api={this.props.api} 
					/>

					<div className={cssf(css, "list-item-inner")} onClick={this.onEnter.bind(this)}>
						<i className={cssf(css, "!fas !fa-folder item-icon")}></i>
						<p className={cssf(css, "item-label text")}>{this.props.item.name}</p>
					</div>
				</div>
			)
		}
	}
}

export default Item;
