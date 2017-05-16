import { combineReducers } from 'redux';

import * as actions from '../actions';

const initialStreamState = false;
export function streamReady(state = initialStreamState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.STREAM_READY: {
			return true;
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialStreamState;
		}
		default: {
			return state;
		}
	}
}

const initialBattleState = { choice1: { color:{} }, choice2: { color:{} }, info: {} }
export function battle(state = initialBattleState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.SET_BATTLE: {
			const { battle } = action.payload;
			return {
				...battle
			};
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialBattleState;
		}
		default: {
			return state;
		}
	}
}

// const initialSessionState = {}
// export function session(state = initialSessionState, action = {}) {
// 	switch (action.type) {
// 		case actions.ui.uiActionTypes.SET_BATTLE: {
// 			const { session } = action.payload;
// 			return {
// 				...session
// 			};
// 		}
// 		case actions.ui.uiActionTypes.CLEAR_STATE: {
// 			return initialSessionState;
// 		}
// 		default: {
// 			return state;
// 		}
// 	}
// }

const initialChoiceState = { color: {} };
export function choice(state = initialChoiceState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.SET_CHOICE: {
			const { choice } = action.payload;
			return {
				...choice
			};
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialChoiceState;
		}
		default: {
			return state;
		}
	}
}

const initialEmojiSetState = [];
export function emojiSet(state = initialEmojiSetState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.SET_EMOJISET: {
			const { set } = action.payload;
			return [
				...set
			];
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialEmojiSetState;
		}
		default: {
			return state;
		}
	}
}

const initialCurrentEmojiState = [];
export function currentEmoji(state = initialCurrentEmojiState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.SET_CURRENT_EMOJI: {
			const { emoji } = action.payload;
			return {
				...emoji
			};
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialCurrentEmojiState;
		}
		default: {
			return state;
		}
	}
}

const initialChatVisibilityState = true;
export function chatVisibility(state = initialChatVisibilityState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.TOGGLE_CHAT_VISIBILITY: {
			return !state;
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialChatVisibilityState;
		}
		default: {
			return state;
		}
	}
}

const initialEmojiVisibilityState = false;
export function emojiVisibility(state = initialEmojiVisibilityState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.TOGGLE_EMOJI_VISIBILITY: {
			return !state;
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialEmojiVisibilityState;
		}
		default: {
			return state;
		}
	}
}

const initialShareModalState = false;
export function shareModalVisibility(state = initialShareModalState, action = {}) {
	switch (action.type) {
		case actions.ui.uiActionTypes.SHOW_SHAREMODAL: {
			return true;
		}
		case actions.ui.uiActionTypes.HIDE_SHAREMODAL: {
			return false;
		}
		case actions.ui.uiActionTypes.CLEAR_STATE: {
			return initialShareModalState;
		}
		default: {
			return state;
		}
	}
}

const ui = combineReducers({
	streamReady,
	battle,
	choice,
	emojiSet,
	currentEmoji,
	chatVisibility,
	emojiVisibility,
	shareModalVisibility,
});

export default ui;
