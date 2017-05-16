// API ACTION SUFFIXES
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createAction(type, payload = {}, meta) {
	return { type, payload, meta };
}

export const createUiActionType = (type) => {
	const uiActionType = `zender/UI/${type}`;
	return uiActionType;
};

export const createUiAction = (type, payload, meta) => createAction(type, payload, meta);

export const createPushActionType = (type) => {
	const uiActionType = `zender/PUSH/${type}`;
	return uiActionType;
};

export const createPushAction = (type, payload, meta) => createAction(type, payload, meta);

export const createNativeActionType = (type) => {
	const uiActionType = `zender/NATIVE/${type}`;
	return uiActionType;
};

export const createNativeAction = (type, payload, meta) => createAction(type, payload, meta);

export const createApiActionTypes = (type) => {
	const apiActionType = `zender/API/${type}`;
	return {
		REQUEST: `${apiActionType}_${REQUEST}`,
		SUCCESS: `${apiActionType}_${SUCCESS}`,
		FAILURE: `${apiActionType}_${FAILURE}`,
	};
};

export const createWebActionType = (type) => {
	const uiActionType = `zender/WEB/${type}`;
	return uiActionType;
};

export const createWebAction = (type, payload, meta) => createAction(type, payload, meta);

export const createApiActions = (actionTypes) => {
	const apiActions = {
		request: (request, meta) => createAction(actionTypes.REQUEST, { request }, meta),
		success: (request, response, meta) => createAction(actionTypes.SUCCESS, { request, response }, meta),
		failure: (request, error, meta) => createAction(actionTypes.FAILURE, { request, error }, meta),
	};
	return apiActions;
};
