import { call, fork, takeEvery } from 'redux-saga/effects';

import apiCall from './util';
import API from '../api';
import { actions as zenderActions } from 'zender-api-client';
import * as actions from '../actions';

class Battle {

	constructor(config) {
		const api = new API(config);
		this.config = config;
		// api-call definitions
		this.getBattlesApiCall = apiCall.bind(null, actions.battle.apiActions.getBattles, api.getBattles());
		this.addBattleApiCall = apiCall.bind(null, actions.battle.apiActions.addBattle, api.addBattle());
		this.deleteBattleApiCall = apiCall.bind(null, actions.battle.apiActions.deleteBattle, api.deleteBattle());
		// saga definitions
		this.getBattlesSaga = this.createGetBattlesSaga();
		this.addBattleSaga = this.createAddBattleSaga();
		this.deleteBattleSaga = this.createDeleteBattleSaga();
		// listener definitions
		this.getBattlesListener = this.createGetBattlesListener();
		this.addBattleListener = this.createAddBattleListener();
		this.deleteBattleListener = this.createDeleteBattleListener();
	}

	createGetBattlesSaga() {
		const generator = function* loadBattles() {
			yield call(this.getBattlesApiCall);
		};
		return generator.bind(this);
	}

	createAddBattleSaga() {
		const generator = function* addBattle(action) {
			yield call(this.addBattleApiCall, action.payload);
		};
		return generator.bind(this);
	}

	createDeleteBattleSaga() {
		const generator = function* deleteBattle(action) {
			yield call(this.deleteBattleApiCall, action.payload);
		};
		return generator.bind(this);
	}

	createGetBattlesListener() {
		const listener = function* getBattlesListener() {
			yield takeEvery([zenderActions.channel.uiActionTypes.BOOTSTRAP, actions.battle.uiActionTypes.GET_BATTLES], this.getBattlesSaga);
		};
		return listener.bind(this);
	}

	createAddBattleListener() {
		const listener = function* addBattleListener() {
			yield takeEvery(actions.battle.uiActionTypes.ADD_BATTLE, this.addBattleSaga);
		};
		return listener.bind(this);
	}

	createDeleteBattleListener() {
		const listener = function* deleteBattleListener() {
			yield takeEvery(actions.battle.uiActionTypes.DELETE_BATTLE, this.deleteBattleSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.getBattlesListener),
			fork(this.addBattleListener),
			fork(this.deleteBattleListener),
		];
	}
}

export default Battle;
