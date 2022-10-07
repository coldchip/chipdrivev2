import React, { useRef, useState } from 'react';

import Account from './Account.jsx';
import LogoutPrompt from './LogoutPrompt.jsx';

import DropDown from './DropDown.jsx';

import css from "../../css/index.scss";
import cssf from "../CSSFormat";

function AccountDropdown(props) {
	const [accountPopup, setAccountPopup] = useState(false);
	const [logoutPrompt, setLogoutPrompt] = useState(false);

	return (
		<>
			<DropDown {...props}>
				<div className={cssf(css, "row cd-option-modal m-0 p-0")}>
					<button onClick={() => setAccountPopup(true)} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-user me-2")}></i>
						My Account
					</button>

					<button onClick={() => setLogoutPrompt(true)} className={cssf(css, "col-12 cd-option-modal-button text")}>
						<i className={cssf(css, "!fas !fa-sign-out me-2")}></i>
						Logout
					</button>
				</div>
			</DropDown>

			<Account
				open={accountPopup}
				onClose={() => setAccountPopup(false)}
			/>

			<LogoutPrompt
				open={logoutPrompt}
				onAccept={() => setLogoutPrompt(false)}
				onClose={() => setLogoutPrompt(false)}
			/>
		</>
	);
}

export default AccountDropdown;