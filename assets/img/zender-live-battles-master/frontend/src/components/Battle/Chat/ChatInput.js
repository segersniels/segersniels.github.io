import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as zenderActions, selectors as zenderSelectors } from 'zender-api-client';

import * as actions from './../../../actions';
import * as selectors from './../../../selectors';

class ChatInputPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = ({ shout: '' });
		this.handleChange = this.handleChange.bind(this);
		this.checkForEnter = this.checkForEnter.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const shout = event.target.value;
		this.setState({ shout });
	}

	checkForEnter(target) {
		const { onSubmit } = this.props;
	    if(target.charCode === 13) {
	    	const { shout } = this.state;
	    	if(shout !== '') {
            	onSubmit(shout);
	    	}
        	this.setState({ shout: '' });
	    }
	}

	handleSubmit(){
		const { onSubmit } = this.props;
		const { shout } = this.state;
    	if(shout !== '') {
        	onSubmit(shout);
    	}
		this.setState({ shout: '' });
	}

	render() {
		const { authenticated, choice, enabled, placeholder, session, onInputClick } = this.props;

		return (
			<div className="chatInput">
				<div className="chatInput__teamColor" style={{ background: `rgb(${choice.color.r}, ${choice.color.g}, ${choice.color.b})` }}></div>
				<input
					className="chatInput__input"
					type="text"
					placeholder={authenticated ? placeholder : 'Log eerst in om te kunnen chatten met andere supporters' }
					value={this.state.shout}
					maxLength="70"
					disabled={!enabled}
					onClick={() => onInputClick(session.id, choice.id)}
					onChange={this.handleChange}
					onKeyPress={this.checkForEnter}
				/>
				<div className="chatInput__send" onClick={this.handleSubmit}>Verzenden</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: zenderSelectors.auth.authenticatedSelector(state),
		choice: selectors.ui.choiceSelector(state),
		enabled: zenderSelectors.shoutbox.enabledSelector(state),
		placeholder: zenderSelectors.shoutbox.placeholderSelector(state),
		session: selectors.session.sessionSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onInputClick: (sessionId, choiceId) => {
			dispatch(actions.session.uiActions.joinSession(sessionId, choiceId));
		},
		onSubmit: (shout) => {
			dispatch(zenderActions.shoutbox.uiActions.shout(shout));
		},
	};
}
const ChatInput = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ChatInputPresentational);

export default ChatInput;
