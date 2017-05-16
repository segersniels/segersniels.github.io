import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const BattleItemPresentational = ({ battle, onWatchClick }) => (
	<div className="battleItem">
		<div className="battleItem__header row">
			<div className="battleItem__league">{battle.info.league}</div>
			<div className="battleItem__status">
				<div className="battleItem__statusContent">Live</div>
			</div>
		</div>

		<div className="battleItem__matchInfo">
			<div className="battleItem__team battleItem__team--team1">
				<div className="battleItem__clubLogo">
					<img src={battle.choice1.avatar} alt={battle.choice1.choiceName + '_avatar'} />
				</div>
				<div className="battleItem__clubName">
					{battle.choice1.choiceName}
				</div>
			</div>
			<div className="battleItem__score">
				{battle.choice1.score} <span className="battleItem__scoreSep">-</span> {battle.choice2.score}
			</div>
			<div className="battleItem__team battleItem__team--team2">
				<div className="battleItem__clubLogo">
					<img src={battle.choice2.avatar} alt={battle.choice2.choiceName + '_avatar'} />
				</div>
				<div className="battleItem__clubName">
					{battle.choice2.choiceName}
				</div>
			</div>
		</div>

		<div className="battleItem__footer">
			<button className="button" onClick={() => onWatchClick(battle.id, battle.sessionId)}>Bekijk de livestream</button>
		</div>
	</div>
);

const mapDispatchToProps = (dispatch) => {
	return {
		onWatchClick: (battleId, sessionId) => {
			dispatch(push(`/battle/${battleId}/${sessionId}`));
		},
	};
}
const BattleItem = connect(
	null,
	mapDispatchToProps,
)(BattleItemPresentational);

export default BattleItem;