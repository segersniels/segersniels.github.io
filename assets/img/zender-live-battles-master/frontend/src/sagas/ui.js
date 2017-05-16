import { fork, takeEvery, select, put, take } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { actions as zenderActions, selectors as zenderSelectors } from 'zender-api-client';
import * as actions from '../actions';
import * as selectors from '../selectors';

class UI {

	constructor(config) {
		this.config = config;
		// saga definitions
		this.prepareDetailSaga = this.createPrepareDetailSaga();
		this.streamReadySaga = this.createStreamReadySaga();
		this.prepareRoomSaga = this.createPrepareRoomSaga();
		this.joinPublicSaga = this.createJoinPublicSaga();
		this.joinPrivateSaga = this.createJoinPrivateSaga();
		this.clearStateSaga = this.createClearStateSaga();
		// listener definitions
		this.prepareDetailListener = this.createPrepareDetailListener();
		this.streamReadyListener = this.createStreamReadyListener();
		this.prepareRoomListener = this.createPrepareRoomListener();
		this.joinPublicListener = this.createJoinPublicListener();
		this.joinPrivateListener = this.createJoinPrivateListener();
		this.clearStateListener = this.createClearStateListener();
	}

	createPrepareDetailSaga() {
		const generator = function* prepareDetail(action) {
			const { battleId, sessionId } = action.payload;

			// Get battle
			const battles = yield select(selectors.battle.battlesSelector);
			const battle = battles[battleId];

			// Subscribe to zender stream
			yield put(zenderActions.stream.uiActions.unsubscribe());
			// clear the stream state
			yield put(zenderActions.stream.uiActions.clearState());
			// bootstrap the stream
			yield put(zenderActions.stream.uiActions.bootstrap({ streamId: battle.streamId }));

			// Set battle
			yield put(actions.ui.uiActions.setBattle(battle));

			// Set session
			yield put(actions.session.uiActions.getSession(sessionId));
		};
		return generator.bind(this);
	}

	createStreamReadySaga() {
		const generator = function* prepareDetail(action) {
			// Set session
			yield put(actions.ui.uiActions.streamReady());
		};
		return generator.bind(this);
	}

	createPrepareRoomSaga() {
		const generator = function* prepareRoom(action) {
			const { choiceId } = action.payload;

			// Set choice
			const battle = yield select(selectors.ui.battleSelector);
			const choice = choiceId === 1 ? battle.choice1 : battle.choice2;
			choice.id = choiceId;
			yield put(actions.ui.uiActions.setChoice(choice));

			// Set emojiset
			const emojisSets = yield select(zenderSelectors.emojis.setsSelector);
			const emojiSet = emojisSets[choiceId - 1].emojis;
			yield put(actions.ui.uiActions.setEmojiSet(emojiSet));

			// Set current emoji to first in set
			const emoji = emojiSet[0];
			yield put(actions.ui.uiActions.setCurrentEmoji(emoji));

			// Join session
			const auth = yield select(zenderSelectors.auth.authenticatedSelector);
			if(auth) {
				const sessionId = yield select(selectors.session.sessionIdSelector);
				yield put(actions.session.uiActions.joinSession(sessionId, choiceId));
			}
		};
		return generator.bind(this);
	}

	createJoinPublicSaga() {
		const generator = function* joinPublic(action) {
			const { battleId, sessionId } = action.payload;

			// Login user
			const auth = yield select(zenderSelectors.auth.authenticatedSelector);
			if(auth === false) {
				yield put(actions.authBattle.uiActions.login());
				yield take(zenderActions.auth.apiActionTypes.LOGIN.SUCCESS);
			}

			// Get choice
			const choice = yield select(selectors.ui.choiceSelector);
			const choiceId = choice.id;

			// Join session
			yield put(actions.session.uiActions.joinSession(sessionId, choiceId));

			// Set session
			yield put(actions.session.uiActions.getSession(sessionId));

			// Redirect to session
			yield put(push(`/battle/${battleId}/${sessionId}`));
		};
		return generator.bind(this);
	}

	createJoinPrivateSaga() {
		const generator = function* joinPrivate(action) {
			const { battleId } = action.payload;

			// Login user
			const auth = yield select(zenderSelectors.auth.authenticatedSelector);
			if(auth === false) {
				yield put(actions.authBattle.uiActions.login());
				yield take(zenderActions.auth.apiActionTypes.LOGIN.SUCCESS);
			}

			// Create session
			yield put(actions.session.uiActions.createSession(battleId));
			const actionTake = yield take(actions.session.apiActionTypes.CREATE_SESSION.SUCCESS);
			const sessionId = actionTake.payload.response.id;

			// Get choice
			const choice = yield select(selectors.ui.choiceSelector);
			const choiceId = choice.id;

			// Join session
			yield put(actions.session.uiActions.joinSession(sessionId, choiceId));

			// Redirect to session
			yield put(push(`/battle/${battleId}/${sessionId}`));
		};
		return generator.bind(this);
	}

	createClearStateSaga() {
		const generator = function* clearState() {
			yield put(actions.ui.uiActions.clearState());
		};
		return generator.bind(this);
	}

	createPrepareDetailListener() {
		const listener = function* prepareDetailListener() {
			yield takeEvery(actions.ui.uiActionTypes.PREPARE_DETAIL, this.prepareDetailSaga);
		};
		return listener.bind(this);
	}

	createStreamReadyListener() {
		const listener = function* streamReadyListener() {
			yield takeEvery(zenderActions.stream.uiActionTypes.READY, this.streamReadySaga);
		};
		return listener.bind(this);
	}

	createPrepareRoomListener() {
		const listener = function* prepareRoomListener() {
			yield takeEvery(actions.ui.uiActionTypes.PREPARE_ROOM, this.prepareRoomSaga);
		};
		return listener.bind(this);
	}

	createJoinPublicListener() {
		const listener = function* joinPublicListener() {
			yield takeEvery(actions.ui.uiActionTypes.JOIN_PUBIC, this.joinPublicSaga);
		};
		return listener.bind(this);
	}

	createJoinPrivateListener() {
		const listener = function* joinPrivateListener() {
			yield takeEvery(actions.ui.uiActionTypes.JOIN_PRIVATE, this.joinPrivateSaga);
		};
		return listener.bind(this);
	}

	createClearStateListener() {
		const listener = function* clearStateListener() {
			yield takeEvery(actions.session.uiActionTypes.LEAVE_SESSION, this.clearStateSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.prepareDetailListener),
			fork(this.streamReadyListener),
			fork(this.prepareRoomListener),
			fork(this.joinPublicListener),
			fork(this.joinPrivateListener),
			// fork(this.clearStateListener),
		];
	}
}

export default UI;
