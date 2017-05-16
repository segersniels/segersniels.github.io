import React from 'react';

const Logout = ({ onLogoutClick }) => (
	<button className="button button__primary header__authButton" onClick={onLogoutClick}>Logout</button>
);

export default Logout;