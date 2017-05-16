import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors as zenderSelectors } from 'zender-api-client';

import ChatInput from './Chat/ChatInput';
import CurrentEmoji from './Emojis/CurrentEmoji';
import EmojiList from './Emojis/EmojiList';

import * as actions from './../../actions';
import * as selectors from './../../selectors';

class FooterPresentational extends Component {
	constructor(props) {
		super(props);
		this.checkUserLoggedIn = this.checkUserLoggedIn.bind(this);
	}

	checkUserLoggedIn() {
		const { user } = this.props;
		if(user && user.authenticated) {
			return true;
		}
		else return false;
	}

	render() {
		const {
			battle,
			currentEmoji,
			emojis,
			emojiVisibility,
			session,
			onShareClick,
			onCurrentEmojiClick,
			onEmojiClick,
			onPrivateClick
		 } = this.props;

		return (
			<div className="footer">
				<div className="footer__chat">
					<ChatInput />
					<div className="footer__session">
						{ session.id === battle.sessionId ?
							<button className="button button--friends" onClick={() => onPrivateClick(battle.sessionId, battle.id)}>Chatten met vrienden</button>
							:
							<button className="button button--share" onClick={onShareClick}>Delen met vrienden</button>
						}
					</div>
				</div>

				<div className="footer__currentEmoji" onClick={onCurrentEmojiClick}>
					<CurrentEmoji currentEmoji={currentEmoji} />
				</div>

				<div className={ emojiVisibility ? "footer__emojis footer__emojis--visible" : "footer__emojis footer__emojis--invisible"}>
					<EmojiList emojis={emojis} onEmojiClick={onEmojiClick} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		battle: selectors.ui.battleSelector(state),
		currentEmoji: selectors.ui.currentEmojiSelector(state),
		emojis: selectors.ui.emojiSetSelector(state),
		emojiVisibility: selectors.ui.emojiVisibilitySelector(state),
		session: selectors.session.sessionSelector(state),
		user: zenderSelectors.auth.userSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onShareClick: () => {
			dispatch(actions.ui.uiActions.showShareModal());
		},
		onCurrentEmojiClick: () => {
			dispatch(actions.ui.uiActions.toggleEmojiVisibility());
		},
		onEmojiClick: (emoji) => {
			dispatch(actions.ui.uiActions.setCurrentEmoji(emoji));
			dispatch(actions.ui.uiActions.toggleEmojiVisibility());
		},
		onPrivateClick: (sessionId, battleId) => {
			dispatch(actions.session.uiActions.leaveSession(sessionId));
			dispatch(actions.ui.uiActions.joinPrivate(battleId));
		},
	};
}

const Footer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(FooterPresentational);

export default Footer;
