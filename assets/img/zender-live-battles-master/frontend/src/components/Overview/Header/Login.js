import React from 'react';

const Login = ({ onLoginClick }) => (
	<button className="button button__primary header__authButton" onClick={onLoginClick}>Login</button>
);

export default Login;