import React from 'react';

import Login from './Login';
import Logout from './Logout';

const Auth = ({ status, onLoginClick, onLogoutClick }) => (
	<div className="battleHeader__auth">
		{ status ? 
			<Logout onLogoutClick={onLogoutClick} /> : 
			<Login onLoginClick={onLoginClick} />
		}
	</div>
);

export default Auth;