import React, { useRef, useState, useContext, useCallback } from 'react';

import fetch from './../fetch.js';

import TokenContext from './../contexts/TokenContext.jsx';
import ChipDriveContext from './../contexts/ChipDriveContext.jsx';

import DropDown from './DropDown.jsx';
import GetLinkPopup from './GetLinkPopup.jsx';
import ItemInfoPopup from './ItemInfoPopup.jsx';
import Prompt from './Prompt.jsx';
import Confirm from './Confirm.jsx';
import css from "./../assets/style/index.scss";
import cssf from "./../CSSFormat";

function ItemDropdown(props) {
	var token = useContext(TokenContext);
	var dispatch = useContext(ChipDriveContext);

	// rename prompt
	const [renamePrompt, setRenamePrompt] = useState(false);
	const [renamePromptLoading, setRenamePromptLoading] = useState(false);
	const [renamePromptError, setRenamePromptError] = useState("");

	// delete prompt
	const [deletePrompt, setDeletePrompt] = useState(false);
	const [deletePromptLoading, setDeletePromptLoading] = useState(false);
	const [deletePromptError, setDeletePromptError] = useState("");

	// GetLink popup
	var [getLinkPopup, setGetLinkPopup] = useState(false);

	// Download prompt
	var [downloadPrompt, setdownloadPrompt] = useState(false);

	// ItemInfo popup
	var [itemInfoPopup, setItemInfoPopup] = useState(false);

	var rename = useCallback((name) => {
		setRenamePromptLoading(true);
		setRenamePromptError(undefined);

		fetch(`/api/v2/drive/object/${props.item.id}`, {
			method: "PATCH",
			body: new URLSearchParams({
				name: name
			}).toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				token: token
			}
		}).then(() => {
			setRenamePrompt(false);

			dispatch({
				type: "list"
			});
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				setRenamePrompt(false);
				dispatch({
					type: "login",
					data: true
				});
			} else {
				setRenamePromptError(body.message);
			}
		}).finally(() => {
			setRenamePromptLoading(false);
		});
	}, [dispatch, props.item.id, token]);

	var remove = useCallback(() => {
		setDeletePromptLoading(true);
		setDeletePromptError(undefined);

		fetch(`/api/v2/drive/object/${props.item.id}`, {
			method: "DELETE",
			headers: {
				token: token
			}
		}).then(() => {
			setDeletePrompt(false);

			dispatch({
				type: "list"
			});
		}).catch((response) => {
			var {status, body} = response;

			if(status === 401) {
				setDeletePrompt(false);
				dispatch({
					type: "login",
					data: true
				});
			} else {
				setDeletePromptError(body.message);
			}
		}).finally(() => {
			setDeletePromptLoading(false);
		});
	}, [dispatch, props.item.id, token]);

	var download = () => {
		var {item} = props;

		var link = `/api/v2/drive/object/${item.id}`;
			
		var a = document.createElement("a");
		a.style.display = "none";
		a.style.width = "0px";
		a.style.height = "0px";
		a.href = link;
		a.download = item.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	return (
		<>
			<DropDown {...props}>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					<button onClick={() => {
						setRenamePrompt(true);
						setRenamePromptLoading(false);
						setRenamePromptError("");
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-pen-square me-2")}></i>
						Rename
					</button>

					<button onClick={() => {
						setDeletePrompt(true);
						setDeletePromptLoading(false);
						setDeletePromptError("");
					}} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-trash-alt me-2")}></i>
						Delete
					</button>
					
					{
						props.item.type === 1 &&
						<>
						
							<button onClick={() => setGetLinkPopup(true)} className={cssf(css, "col-12 cd-option-modal-button text")}>
								<i className={cssf(css, "!fas !fa-link me-2")}></i>
								Get link
							</button>
							<button onClick={() => setdownloadPrompt(true)} className={cssf(css, "col-12 cd-option-modal-button text")}>
								<i className={cssf(css, "!fas !fa-arrow-circle-down me-2")}></i>
								Download
							</button>
							<button onClick={() => setItemInfoPopup(true)} className={cssf(css, "col-12 cd-option-modal-button text")}>
								<i className={cssf(css, "!fas !fa-info-circle me-2")}></i>
								Info
							</button>
						</>
					}
				</div>
			</DropDown>

			<Prompt 
				title="Rename this item?" 
				open={renamePrompt}
				loading={renamePromptLoading}
				error={renamePromptError}
				onAccept={(name) => {
					rename(name);
				}}
				onClose={() => {
					setRenamePrompt(false);
				}} 
			/>
			
			<Confirm 
				title="Delete this item?" 
				open={deletePrompt}
				loading={deletePromptLoading}
				error={deletePromptError}
				onAccept={() => {
					remove();
				}}
				onClose={() => {
					setDeletePrompt(false);
				}} 
			/>

			<GetLinkPopup 
				open={getLinkPopup}
				onClose={() => {
					setGetLinkPopup(false);
				}}
				item={props.item}
			/>

			<Confirm 
				title="Download this item?" 
				open={downloadPrompt}
				onAccept={() => {
					setdownloadPrompt(false);
					download();
				}}
				onClose={() => {
					setdownloadPrompt(false);
				}} 
			/>

			<ItemInfoPopup 
				item={props.item}
				open={itemInfoPopup}
				onClose={() => {
					setItemInfoPopup(false);
				}} 
			/>
		</>
	);
}

export default ItemDropdown;