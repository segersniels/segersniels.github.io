import React from 'react';
import { connect } from 'react-redux';
import keys from 'lodash/keys';

import * as selectors from './../../selectors';

const CountersPresentational  = ({ battle, mostUsedEmoji, setCounters }) => (
	<div className="counters">
		<div className="counters__team counters__team--team1">
			<div className="counters__teamColor" style={{ backgroundColor: `rgb(${battle.choice1.color.r}, ${battle.choice1.color.g}, ${battle.choice1.color.b})` }}></div>
			<div className="counters__count">{setCounters[keys(setCounters)[0]]}</div>
		</div>
		<div className="counters__emoji"><img className="counters__image" alt="Most used emoji" src={mostUsedEmoji.url} /></div>
		<div className="counters__team counters__team--team2">
			<div className="counters__count">{setCounters[keys(setCounters)[1]]}</div>
			<div className="counters__teamColor" style={{ backgroundColor: `rgb(${battle.choice2.color.r}, ${battle.choice2.color.g}, ${battle.choice2.color.b})` }}></div>
		</div>
	</div>
);

const mapStateToProps = (state) => {
	return {
		battle: selectors.ui.battleSelector(state),
		setCounters: selectors.zender.setCountersSelector(state),
		mostUsedEmoji: selectors.zender.mostUsedEmojiSelector(state),
	};
}
const Counters = connect(
	mapStateToProps,
	null,
)(CountersPresentational);

export default Counters;
