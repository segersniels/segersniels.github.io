import {
	createUiActionType,
	createUiAction,
	createApiActionTypes,
	createApiActions,
	createPushActionType,
	createPushAction,
} from './util';

export const uiActionTypes = {
	GET_BATTLES: createUiActionType('BATTLES/GET_BATTLES'),
	ADD_BATTLE: createUiActionType('BATTLES/ADD_BATTLE'),
	DELETE_BATTLE: createUiActionType('BATTLES/DELETE_BATTLE'),
};

export const uiActions = {
	getBattles: () => createUiAction(uiActionTypes.GET_BATTLES),
	addBattle: (battle) => createUiAction(uiActionTypes.ADD_BATTLE, { battle }),
	deleteBattle: (battleId) => createUiAction(uiActionTypes.DELETE_BATTLE, { battleId }),
};

export const apiActionTypes = {
	GET_BATTLES: createApiActionTypes('BATTLES/GET_BATTLES'),
	ADD_BATTLE: createApiActionTypes('BATTLES/ADD_BATTLE'),
	DELETE_BATTLE: createApiActionTypes('BATTLES/DELETE_BATTLE'),
};

export const apiActions = {
	getBattles: createApiActions(apiActionTypes.GET_BATTLES),
	addBattle: createApiActions(apiActionTypes.ADD_BATTLE),
	deleteBattle: createApiActions(apiActionTypes.DELETE_BATTLE),
};

export const pushActionTypes = {
	SUBSCRIBED: createPushActionType('BATTLE/SUBSCRIBED'),
	UNSUBSCRIBED: createPushActionType('BATTLE/UNSUBSCRIBED'),
	BATTLE_ADD: createPushActionType('BATTLE/BATTLE_ADD'),
	BATTLE_DELETE: createPushActionType('BATTLE/BATTLE_DELETE'),
};

export const pushActions = {
	subscribed: () => createPushAction(pushActionTypes.SUBSCRIBED),
	unsubscribed: () => createPushAction(pushActionTypes.UNSUBSCRIBED),
	battleAdd: data => createPushAction(pushActionTypes.BATTLE_ADD, data),
	battleDelete: data => createPushAction(pushActionTypes.BATTLE_DELETE, data),
};