import {
	createUiActionType,
	createUiAction,
	createApiActionTypes,
	createApiActions,
} from './util';

export const uiActionTypes = {
	LOGIN: createUiActionType('AUTH_BATTLE/LOGIN'),
	LOGOUT: createUiActionType('AUTH_BATTLE/LOGOUT'),
};

export const uiActions = {
	login: () => createUiAction(uiActionTypes.LOGIN),
	logout: () => createUiAction(uiActionTypes.LOGOUT),
};

export const apiActionTypes = {
	LOGIN: createApiActionTypes('AUTH_BATTLE/LOGIN'),
	LOGOUT: createApiActionTypes('AUTH_BATTLE/LOGOUT'),
};

export const apiActions = {
	login: createApiActions(apiActionTypes.LOGIN),
	logout: createApiActions(apiActionTypes.LOGOUT),
};