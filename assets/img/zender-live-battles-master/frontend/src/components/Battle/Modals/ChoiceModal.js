import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import * as actions from './../../../actions';
import * as selectors from './../../../selectors';

class ChoiceModalPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = ({ showModal: true });
	}

	render() {
		const { streamReady, battle, onChoiceClick } = this.props;

		return (
			<ReactModal
				isOpen={this.state.showModal}
				contentLabel="Pick your team!"
				className="ChoiceModal"
				overlayClassName="ChoiceModal__overlay"
			>
				<div className="choiceModal__title">
					<h3>Kies jouw favoriete team</h3>
				</div>

				<div className="choiceModal__description">
					<p>Kies jouw favoriete team en reageer met aangepaste emoji’s op de match of chat in de ploegkleuren met andere supporters!</p>
				</div>

				<div className="choiceModal__options">
					<div
						className="choiceModal__team choiceModal__team--left"
						style={{ borderColor: `rgb(${battle.choice1.color.r}, ${battle.choice1.color.g}, ${battle.choice1.color.b})` }}
						onClick={() => {
							if(streamReady) {
								onChoiceClick(1);
								this.setState({ showModal: false });
							}
						}}
					>
						<div className="choiceModal__teamImage">
							<img className="choiceModal__avatar" src={battle.choice1.avatar} alt={battle.choice1.choiceName + '_avatar'} />
						</div>
						<div className="choiceModal__teamName">{battle.choice1.choiceName}</div>
					</div>
					<div
						className="choiceModal__team choiceModal__team--right"
						style={{ borderColor: `rgb(${battle.choice2.color.r}, ${battle.choice2.color.g}, ${battle.choice2.color.b})` }}
						onClick={() => {
							if(streamReady) {
								onChoiceClick(2);
								this.setState({ showModal: false });
							}
						}}
					>
						<div className="choiceModal__teamImage">
							<img className="choiceModal__avatar" src={battle.choice2.avatar} alt={battle.choice2.choiceName + '_avatar'} />
						</div>
						<div className="choiceModal__teamName">{battle.choice2.choiceName}</div>
					</div>
				</div>
			</ReactModal>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		streamReady: selectors.ui.streamReadySelector(state),
		battle: selectors.ui.battleSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onChoiceClick: (id) => {
			dispatch(actions.ui.uiActions.prepareRoom(id));
		}
	};
}
const ChoiceModal = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ChoiceModalPresentational);

export default ChoiceModal;
