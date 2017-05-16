import {
	createUiActionType,
	createUiAction,
	createApiActionTypes,
	createApiActions,
	createPushActionType,
	createPushAction,
} from './util';

export const uiActionTypes = {
	GET_SESSION: createUiActionType('SESSION/GET_SESSION'),
	CREATE_SESSION: createUiActionType('SESSION/CREATE_SESSION'),
	JOIN_SESSION: createUiActionType('SESSION/JOIN_SESSION'),
	LEAVE_SESSION: createUiActionType('SESSION/LEAVE_SESSION'),
};

export const uiActions = {
	getSession: (sessionId) => createUiAction(uiActionTypes.GET_SESSION, { sessionId }),
	createSession: (battleId) => createUiAction(uiActionTypes.CREATE_SESSION, { battleId }),
	joinSession: (sessionId, choice) => createUiAction(uiActionTypes.JOIN_SESSION, { sessionId, choice }),
	leaveSession: (sessionId) => createUiAction(uiActionTypes.LEAVE_SESSION, { sessionId }),
};

export const apiActionTypes = {
	GET_SESSION: createApiActionTypes('SESSION/GET_SESSION'),
	CREATE_SESSION: createApiActionTypes('SESSION/CREATE_SESSION'),
	JOIN_SESSION: createApiActionTypes('SESSION/JOIN_SESSION'),
	LEAVE_SESSION: createApiActionTypes('SESSION/LEAVE_SESSION'),
};

export const apiActions = {
	getSession: createApiActions(apiActionTypes.GET_SESSION),
	createSession: createApiActions(apiActionTypes.CREATE_SESSION),
	joinSession: createApiActions(apiActionTypes.JOIN_SESSION),
	leaveSession: createApiActions(apiActionTypes.LEAVE_SESSION),
};

export const pushActionTypes = {
	SUBSCRIBED: createPushActionType('SESSION/SUBSCRIBED'),
	UNSUBSCRIBED: createPushActionType('SESSION/UNSUBSCRIBED'),
	SESSION_JOIN: createPushActionType('SESSION/SESSION_JOIN'),
	SESSION_LEAVE: createPushActionType('SESSION/SESSION_LEAVE'),
};

export const pushActions = {
	subscribed: () => createPushAction(pushActionTypes.SUBSCRIBED),
	unsubscribed: () => createPushAction(pushActionTypes.UNSUBSCRIBED),
	sessionJoin: data => createPushAction(pushActionTypes.SESSION_JOIN, data),
	sessionLeave: data => createPushAction(pushActionTypes.SESSION_LEAVE, data),
};