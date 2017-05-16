import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors as zenderSelectors } from 'zender-api-client';
import isEmpty from 'lodash/isEmpty';
import takeRight from 'lodash/takeRight';

import ChatItem from './ChatItem';

import * as selectors from './../../../selectors';

class ChatListPresentational extends Component {
	constructor(props) {
		super(props);
		this.getSessionShouts = this.getSessionShouts.bind(this);
	}

	getSessionShouts() {
		var { battle, session, shouts } = this.props;
		if (!isEmpty(session)) {
			// Get all userIds in session and filter
			const sessionUIds = session.choice1.concat(session.choice2);
			shouts = shouts.filter(s => s.type === "system" || sessionUIds.includes(s.user.id));

			// Assign colors based on shout user
			shouts.forEach(s => {
				if(session.choice1.includes(s.user.id)) s.color = battle.choice1.color;
				else if(session.choice2.includes(s.user.id)) s.color = battle.choice2.color;
				else s.color = { r: 0, g: 0, b: 0 }; // Moderator color
			});
		}
		else {
			// Set base color
			shouts.forEach(s => s.color = { r: 0, g: 0, b: 0 });
		}
		return takeRight(shouts, 10);
	}

	render() {
		const shouts = this.getSessionShouts();

		return (
			<div className="chatList">
				{ shouts.map(s => <ChatItem key={s.id || '000'} color={s.color} shout={s}/>) }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		battle: selectors.ui.battleSelector(state),
		session: selectors.session.sessionSelector(state),
		shouts: zenderSelectors.shoutbox.shoutsSelector(state),
	};
}
const ChatList = connect(
	mapStateToProps,
	null,
)(ChatListPresentational);

export default ChatList;
