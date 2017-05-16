import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { selectors as zenderSelectors } from 'zender-api-client';

import GuestImage from './../../../assets/guest-avatar.png';

import * as actions from './../../actions';
import * as selectors from './../../selectors';

class HeaderPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = { battleOptions__desktop: false, battleOptions__mobile: false };
		this.toggleBattleOptions = this.toggleBattleOptions.bind(this);
	}

	toggleBattleOptions(system) {
		switch(system) {
			case 'DESKTOP': 
				this.setState({ battleOptions__desktop: !this.state.battleOptions__desktop });
				break;
			case 'MOBILE': 
				this.setState({ battleOptions__mobile: !this.state.battleOptions__mobile });
				break;
			default: 
				this.setState({ battleOptions__desktop: false, battleOptions__mobile: false });
				break;
		}
	}

	render() {
		const { authenticated, battle, choice, session, user, onPrivateClick, onPublicClick, onShareClick, onChangeTeamClick, onLogoutClick } = this.props;
		const { battleOptions__desktop, battleOptions__mobile } = this.state;

		return (
			<div className="battleHeader">
				<header className="battleHeader__desktop">
					<div className="companyInfo">
						<div className="companyInfo__image"></div>
					</div>
					<div className="matchInfo">
						<div className="matchInfo__club matchInfo__club--team1">
							<div className="matchInfo__clubName">{battle.choice1.short}</div>
							<div className="matchInfo__clubScore">{battle.choice1.score}</div>
							<div className="matchInfo__clubColor" style={{ backgroundColor: `rgb(${battle.choice1.color.r}, ${battle.choice1.color.g}, ${battle.choice1.color.b})` }}></div>
						</div>
						<div className="matchInfo__club matchInfo__club--team2">
							<div className="matchInfo__clubColor" style={{ backgroundColor: `rgb(${battle.choice2.color.r}, ${battle.choice2.color.g}, ${battle.choice2.color.b})` }}></div>
							<div className="matchInfo__clubScore">{battle.choice2.score}</div>
							<div className="matchInfo__clubName">{battle.choice2.short}</div>
						</div>
					</div>
					<div className="accountInfo" onClick={() => this.toggleBattleOptions('DESKTOP')}>
						<div className="accountInfo__name">{ authenticated ? user.name : 'Goeiemiddag' }</div>
						<div className="accountInfo__avatar"><img src={ authenticated ? user.avatar : GuestImage } alt="Avatar" /></div>

						{ battleOptions__desktop &&
							<div className="battleOptions battleOptions__desktop">
								<ul className="battleOptions__list">
									{ session.id === battle.sessionId ?
										<li className="battleOptions__item" onClick={() => onPrivateClick(battle.sessionId, battle.id)}><a href="#">Naar een privésessie</a></li>
										:
										<li className="battleOptions__item" onClick={() => onPublicClick(session.id, battle)}><a href="#">Naar publieke sessie</a></li>
									}
									<li className="battleOptions__item" onClick={() => onShareClick()}><a href="#">Deel deze match</a></li>
									<li className="battleOptions__item" onClick={() => onChangeTeamClick(choice.id)}><a href="#">Wissel van team</a></li>
									<li className="battleOptions__item" onClick={() => onLogoutClick(authenticated)}><a href="#">Terug naar overzicht</a></li>
								</ul>
							</div>
						}
					</div>
				</header>
				<header className="battleHeader__mobile">
					<div className="accountInfo">
						<div className="accountInfo__avatar"><img src={ authenticated ? user.avatar : GuestImage } alt="Avatar" /></div>
					</div>
					<div className="matchInfo">
						<div className="matchInfo__club matchInfo__club--team1">
							<div className="matchInfo__clubName">{battle.choice1.short}</div>
						</div>
						<div className="matchInfo__score">
							<div className="matchInfo__clubColor matchInfo__clubColor--team1" style={{ backgroundColor: `rgb(${battle.choice1.color.r}, ${battle.choice1.color.g}, ${battle.choice1.color.b})` }}></div>
							<div className="matchInfo__clubScore">{battle.choice1.score}</div>
							<div className="matchInfo__scoreSeperator">:</div>
							<div className="matchInfo__clubScore">{battle.choice2.score}</div>
							<div className="matchInfo__clubColor matchInfo__clubColor--team2" style={{ backgroundColor: `rgb(${battle.choice2.color.r}, ${battle.choice2.color.g}, ${battle.choice2.color.b})` }}></div>
						</div>
						<div className="matchInfo__club matchInfo__club--team2">
							<div className="matchInfo__clubName">{battle.choice2.short}</div>
						</div>
					</div>
					<div className="battleMenu__open">
						<div className="battleMenu__icon" onClick={() => this.toggleBattleOptions('MOBILE')}>Openen</div>
					</div>
				</header>
				{ battleOptions__mobile && 
					<aside className="battleOptions__mobile">
						<div className="accountInfo__name">{ authenticated ? user.name : 'Goeiemiddag' }</div>
						<div className="accountInfo__avatar"><img src={ authenticated ? user.avatar : GuestImage } alt="Avatar" /></div>
					</aside>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: zenderSelectors.auth.authenticatedSelector(state),
		battle: selectors.ui.battleSelector(state),
		choice: selectors.ui.choiceSelector(state),
		session: selectors.session.sessionSelector(state),
		user: zenderSelectors.auth.userSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onPrivateClick: (sessionId, battleId) => {
			dispatch(actions.session.uiActions.leaveSession(sessionId));
			dispatch(actions.ui.uiActions.joinPrivate(battleId));
		},
		onPublicClick: (sessionId, battle) => {
			dispatch(actions.session.uiActions.leaveSession(sessionId));
			dispatch(actions.ui.uiActions.joinPublic(battle.id, battle.sessionId));
		},
		onShareClick: () => {
			dispatch(actions.ui.uiActions.showShareModal());
		},
		onChangeTeamClick: (choice) => {
			// alert('change team');
			choice = (choice === 1 ? 2 : 1);
			dispatch(actions.ui.uiActions.prepareRoom(choice));
		},
		onLogoutClick: (authenticated) => {
			if(authenticated) dispatch(actions.authBattle.uiActions.logout());
			dispatch(push('/'));
		},
	};
}
const Header = connect(
	mapStateToProps,
	mapDispatchToProps,
)(HeaderPresentational);

export default Header;
