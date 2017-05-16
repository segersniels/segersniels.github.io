import { put, call, spawn } from 'redux-saga/effects';

import * as actions from '../actions';

export const spawnCatch = function* spawnCatch(store, saga, ...args) {
	const task = yield spawn(saga, ...args);
	const handler = (error) => {
		store.dispatch(actions.client.uiActions.unhandledError(error, saga, args));
	};
	task.done.catch(handler);
	return task;
};

export const spawnWrap = (store, saga, ...args) => call(spawnCatch, store, saga, ...args);

export default function* apiCall(apiAction, apiFn, args, meta) {
	yield put(apiAction.request(args, meta));
	const response = yield call(apiFn, args);
	if (response instanceof Error || response.isError) {
		yield put(apiAction.failure(args, response, meta));
	} else {
		yield put(apiAction.success(args, response, meta));
	}
	return response;
}

