import React from 'react';
import { connect } from 'react-redux';
import { selectors as zenderSelectors } from 'zender-api-client';

import Auth from './Auth';
import UserInfo from './UserInfo';

import * as actions from './../../../actions';

const HeaderPresentational = ({ authenticated, user, onLoginClick, onLogoutClick }) => (
	<div className="header row">
		<div className="container">
			<div className="four columns">
				<h1 className="header__title">Live Battles</h1>
			</div>
			<div className="five columns" style={{display: "none"}}>
				{ authenticated && <UserInfo user={user} /> }
			</div>
			<div className="three columns" style={{display: "none"}}>
				<Auth status={status} onLoginClick={onLoginClick} onLogoutClick={onLogoutClick} />
			</div>
		</div>
	</div>	
);

const mapStateToProps = (state) => {
	return { 
		authenticated: zenderSelectors.auth.authenticatedSelector(state),
		user: zenderSelectors.auth.userSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onLoginClick: () => {
			dispatch(actions.authBattle.uiActions.login());
		},
		onLogoutClick: () => {
			dispatch(actions.authBattle.uiActions.logout());
		},
	};
}
const Header = connect(
	mapStateToProps,
	mapDispatchToProps,
)(HeaderPresentational);

export default Header;