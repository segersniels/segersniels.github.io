import { combineReducers } from 'redux';
import assign from 'lodash/assign';

import * as actions from '../actions';

const initialIsLoadingState = false;
export function isLoading(state = initialIsLoadingState, action = {}) {
	switch (action.type) {
		case actions.session.apiActionTypes.GET_SESSION.REQUEST:
			return true;
		case actions.session.apiActionTypes.GET_SESSION.SUCCESS:
		case actions.session.apiActionTypes.GET_SESSION.FAILURE:
			return false;
		default:
			return state;
	}
}

const initialSubscribedState = false;
export function subscribed(state = initialSubscribedState, action = {}) {
	switch (action.type) {
		case actions.session.pushActionTypes.SUBSCRIBED:
			return true;
		case actions.session.pushActionTypes.UNSUBSCRIBED:
			return false;
		default:
			return state;
	}
}

const initialSessionState = {};
export function data(state = initialSessionState, action = {}) {
	switch (action.type) {
		case actions.session.apiActionTypes.GET_SESSION.SUCCESS: {
			const session = action.payload.response;
			return {
				...state,
				...session
			};
		}
		case actions.session.pushActionTypes.SESSION_JOIN: {
			const { choice1, choice2 } = action.payload.data;
			const session = assign({}, state, { choice1: choice1 }, { choice2: choice2 });
			return session;
		}
		case actions.session.pushActionTypes.SESSION_LEAVE: {
			const { choice1, choice2 } = action.payload.data;
			const session = assign({}, state, { choice1: choice1 }, { choice2: choice2 });
			return session;
		}
		default: {
			return state;
		}
	}
}

const session = combineReducers({
	isLoading,
	subscribed,
	data,
});

export default session;
