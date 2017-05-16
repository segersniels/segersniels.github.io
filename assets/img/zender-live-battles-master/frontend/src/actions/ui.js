import {
	createUiActionType,
	createUiAction
} from './util';

export const uiActionTypes = {
	PREPARE_DETAIL: createUiActionType('UI/PREPARE_DETAIL'),
	STREAM_READY: createUiActionType('UI/STREAM_READY'),
	PREPARE_ROOM: createUiActionType('UI/PREPARE_ROOM'),
	JOIN_PUBIC: createUiActionType('UI/JOIN_PUBIC'),
	JOIN_PRIVATE: createUiActionType('UI/JOIN_PRIVATE'),
	SET_BATTLE: createUiActionType('UI/SET_BATTLE'),
	SET_SESSION: createUiActionType('UI/SET_SESSION'),
	SET_CHOICE: createUiActionType('UI/SET_CHOICE'),
	SET_EMOJISET: createUiActionType('UI/SET_EMOJISET'),
	SET_CURRENT_EMOJI: createUiActionType('UI/SET_CURRENT_EMOJI'),
	TOGGLE_CHAT_VISIBILITY: createUiActionType('UI/TOGGLE_CHAT_VISIBILITY'),
	TOGGLE_EMOJI_VISIBILITY: createUiActionType('UI/TOGGLE_EMOJI_VISIBILITY'),
	SHOW_SHAREMODAL: createUiActionType('UI/SHOW_SHAREMODAL'),
	HIDE_SHAREMODAL: createUiActionType('UI/HIDE_SHAREMODAL'),
	CLEAR_STATE: createUiActionType('UI/CLEAR_STATE'),
};

export const uiActions = {
	prepareDetail: (battleId, sessionId) => createUiAction(uiActionTypes.PREPARE_DETAIL, { battleId, sessionId }),
	streamReady: () => createUiAction(uiActionTypes.STREAM_READY),
	prepareRoom: (choiceId) => createUiAction(uiActionTypes.PREPARE_ROOM, { choiceId }),
	joinPublic: (battleId, sessionId) => createUiAction(uiActionTypes.JOIN_PUBIC, { battleId, sessionId }),
	joinPrivate: (battleId) => createUiAction(uiActionTypes.JOIN_PRIVATE, { battleId }),
	setBattle: (battle) => createUiAction(uiActionTypes.SET_BATTLE, { battle }),
	setSession: (session) => createUiAction(uiActionTypes.SET_SESSION, { session }),
	setChoice: (choice) => createUiAction(uiActionTypes.SET_CHOICE, { choice }),
	setEmojiSet: (set) => createUiAction(uiActionTypes.SET_EMOJISET, { set }),
	setCurrentEmoji: (emoji) => createUiAction(uiActionTypes.SET_CURRENT_EMOJI, { emoji }),
	toggleChatVisibility: (emoji) => createUiAction(uiActionTypes.TOGGLE_CHAT_VISIBILITY),
	toggleEmojiVisibility: () => createUiAction(uiActionTypes.TOGGLE_EMOJI_VISIBILITY),
	showShareModal: () => createUiAction(uiActionTypes.SHOW_SHAREMODAL),
	hideShareModal: () => createUiAction(uiActionTypes.HIDE_SHAREMODAL),
	clearState: () => createUiAction(uiActionTypes.CLEAR_STATE),
};