import { combineReducers } from 'redux';
import keyBy from 'lodash/fp/keyBy';
import assign from 'lodash/assign';
import keys from 'lodash/keys';

import * as actions from '../actions';

const initialStatusState = 'disabled';
export function status(state = initialStatusState, action = {}) {
	switch (action.type) {
		case actions.battle.apiActionTypes.GET_BATTLES.REQUEST:
			return 'bootstrapping';
		case actions.battle.apiActionTypes.GET_BATTLES.FAILURE:
			return 'failed';
		case actions.battle.apiActionTypes.GET_BATTLES.SUCCESS:
			return 'initialized';
		default:
			return state;
	}
}

const initialIsLoadingState = false;
export function isLoading(state = initialIsLoadingState, action = {}) {
	switch (action.type) {
		case actions.battle.apiActionTypes.GET_BATTLES.REQUEST:
			return true;
		case actions.battle.apiActionTypes.GET_BATTLES.SUCCESS:
		case actions.battle.apiActionTypes.GET_BATTLES.FAILURE:
			return false;
		default:
			return state;
	}
}

const initialSubscribedState = false;
export function subscribed(state = initialSubscribedState, action = {}) {
	switch (action.type) {
		case actions.battle.pushActionTypes.SUBSCRIBED:
			return true;
		case actions.battle.pushActionTypes.UNSUBSCRIBED:
			return false;
		default:
			return state;
	}
}

const initialBattleState = {};
export function data(state = initialBattleState, action = {}) {
	switch (action.type) {
		case actions.battle.apiActionTypes.GET_BATTLES.SUCCESS: {
			const incomingBattles = action.payload.response.Items;
			const battles = keyBy('id', incomingBattles);
			return {
				...battles
			};
		}
		case actions.battle.pushActionTypes.BATTLE_ADD: {
			const incomingBattle = action.payload.data;
			const battle = {};
			battle[incomingBattle.id] = incomingBattle;
			const mergedBattles = assign({}, 
				state, 
				battle
			);
			return {
				...mergedBattles
			};
		}
		case actions.battle.pushActionTypes.BATTLE_DELETE: {
			const battleId = action.payload.data.id;
			const battles = keys(state).reduce((result, key) => {
				if (key !== battleId) {
					result[key] = state[key];
				}
				return result;
			}, {});
			return {
				...battles
			};
		}
		default: {
			return state;
		}
	}
}

const battle = combineReducers({
	status,
	isLoading,
	subscribed,
	data,
});

export default battle;
