import React from 'react';

import { useDragLayer } from 'react-dnd'

import css from "./../style/index.scss";
import cssf from "./../../../CSSFormat";

const CustomDragLayer = (props) => {
	const { itemType, isDragging, item, initialOffset, currentOffset } =
	useDragLayer((monitor) => ({
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getClientOffset(),
		isDragging: monitor.isDragging(),
	}));

	return (
		<>
		{
			(isDragging && currentOffset) &&
			<div className={cssf(css, "item-drag-container")}>
				<div className={cssf(css, "item-drag")} style={{
					transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
				}}>
					<p className={cssf(css, "title text")}>
						{
							item.files ?
							<i className={cssf(css, "!fas !fa-upload me-2")}></i>
							:
							<>
								{
									item.type === 1 ?
									<i className={cssf(css, "!fas !fa-file me-2")}></i>
									:
									<i className={cssf(css, "!fas !fa-folder me-2")}></i>
								}
							</>
						}
						{
							item.files ? "Drop file(s) to upload" : item.name
						}
					</p>
				</div>
			</div>
		}
		</>
	);
}

export default CustomDragLayer;