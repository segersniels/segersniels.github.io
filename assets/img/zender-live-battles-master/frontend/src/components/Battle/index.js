import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as zenderActions } from 'zender-api-client';

import Header from './Header';
import Counters from './Counters';
import Sticker from './Sticker';
import Media from './Media';
import EmojiHitarea from './Emojis/EmojiHitarea';
import ChatList from './Chat/ChatList';
import Footer from './Footer';
import ChoiceModal from './Modals/ChoiceModal';
import ShareModal from './Modals/ShareModal';

import * as actions from './../../actions';
import * as selectors from './../../selectors';

class BattlePresentational extends Component {
	componentWillMount() {
		if(this.props.battlesLoaded === 'initialized') {
			const { battleId, sessionId } = this.props.params;
			this.props.onInit(battleId, sessionId);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.battlesLoaded === 'initialized' && this.props.battlesLoaded !== nextProps.battlesLoaded) {
			const { battleId, sessionId } = this.props.params;
			this.props.onInit(battleId, sessionId);
		}
	}

	componentWillUnmount() {
		const { sessionId } = this.props.params;
		this.props.onLeave(sessionId);
	}

	render() {
		return (
			<div className="battle">
				<Header />
				<Counters />
				<Sticker />
				<Media />
				<EmojiHitarea />
				<ChatList />
				<Footer />
				<ChoiceModal />
				<ShareModal />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		battlesLoaded: selectors.battle.statusSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onInit: (battleId, sessionId, streamId) => {
			dispatch(actions.ui.uiActions.prepareDetail(battleId, sessionId));
		},
		onLeave: (sessionId, userId) => {
			dispatch(actions.session.uiActions.leaveSession(sessionId));
			dispatch(zenderActions.stream.uiActions.unsubscribe());
		},
	};
}
const Battle = connect(
	mapStateToProps,
	mapDispatchToProps
)(BattlePresentational);

export default Battle;
