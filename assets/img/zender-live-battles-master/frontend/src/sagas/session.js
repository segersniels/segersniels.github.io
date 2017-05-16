import { call, fork, takeEvery, put, select, take } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { actions as zenderActions, selectors as zenderSelectors } from 'zender-api-client';

import apiCall from './util';
import API from '../api';
import * as actions from '../actions';

class Session {

	constructor(config) {
		const api = new API(config);
		this.config = config;
		// api-call definitions
		this.getSessionApiCall = apiCall.bind(null, actions.session.apiActions.getSession, api.getSession());
		this.createSessionApiCall = apiCall.bind(null, actions.session.apiActions.createSession, api.createSession());
		this.joinSessionApiCall = apiCall.bind(null, actions.session.apiActions.joinSession, api.joinSession());
		this.leaveSessionApiCall = apiCall.bind(null, actions.session.apiActions.leaveSession, api.leaveSession());
		// saga definitions
		this.getSessionSaga = this.createGetSessionSaga();
		this.createSessionSaga = this.createCreateSessionSaga();
		this.joinSessionSaga = this.createJoinSessionSaga();
		this.leaveSessionSaga = this.createLeaveSessionSaga();
		// listener definitions
		this.getSessionListener = this.createGetSessionListener();
		this.createSessionListener = this.createCreateSessionListener();
		this.joinSessionListener = this.createJoinSessionListener();
		this.leaveSessionListener = this.createLeaveSessionListener();
	}

	createGetSessionSaga() {
		const generator = function* loadSession(action) {
			yield call(this.getSessionApiCall, action.payload);
		};
		return generator.bind(this);
	}

	createCreateSessionSaga() {
		const generator = function* createSession(action) {
			const response = yield call(this.createSessionApiCall, action.payload);
			if (!(response instanceof Error || response.isError)) {
				// Set session
				yield put(actions.session.uiActions.getSession(response.id));

				// Redirect
				const url = `/battle/${action.payload.battleId}/${response.id}`;
				yield put(push(url));
			}
		};
		return generator.bind(this);
	}

	createJoinSessionSaga() {
		const generator = function* joinSession(action) {
			const auth = yield select(zenderSelectors.auth.authenticatedSelector);
			if(auth === false) {
				yield put(actions.authBattle.uiActions.login());
				yield take(zenderActions.auth.apiActionTypes.LOGIN.SUCCESS);
			}

			action.payload.userId = yield select(zenderSelectors.auth.userIdSelector);
			yield call(this.joinSessionApiCall, action.payload);
		};
		return generator.bind(this);
	}

	createLeaveSessionSaga() {
		const generator = function* leaveSession(action) {
			action.payload.userId = yield select(zenderSelectors.auth.userIdSelector);
			yield call(this.leaveSessionApiCall, action.payload);
		};
		return generator.bind(this);
	}

	createGetSessionListener() {
		const listener = function* getBattlesListener() {
			yield takeEvery(actions.session.uiActionTypes.GET_SESSION, this.getSessionSaga);
		};
		return listener.bind(this);
	}

	createCreateSessionListener() {
		const listener = function* getBattlesListener() {
			yield takeEvery(actions.session.uiActionTypes.CREATE_SESSION, this.createSessionSaga);
		};
		return listener.bind(this);
	}

	createJoinSessionListener() {
		const listener = function* addBattleListener() {
			yield takeEvery(actions.session.uiActionTypes.JOIN_SESSION, this.joinSessionSaga);
		};
		return listener.bind(this);
	}

	createLeaveSessionListener() {
		const listener = function* deleteBattleListener() {
			yield takeEvery(actions.session.uiActionTypes.LEAVE_SESSION, this.leaveSessionSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.getSessionListener),
			fork(this.createSessionListener),
			fork(this.joinSessionListener),
			fork(this.leaveSessionListener),
		];
	}

}

export default Session;
