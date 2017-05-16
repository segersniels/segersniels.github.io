import { combineReducers } from 'redux';

import * as actions from '../actions';

const initialStatusState = false;
export function status(state = initialStatusState, action = {}) {
	switch (action.type) {
		case actions.sticker.uiActionTypes.SET_STICKER:
			return true;
		case actions.sticker.uiActionTypes.UNSET_STICKER:
			return false;
		default:
			return state;
	}
}

const session = combineReducers({
	status,
});

export default session;
