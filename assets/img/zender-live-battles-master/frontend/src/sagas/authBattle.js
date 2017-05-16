import { fork, takeEvery, select, put } from 'redux-saga/effects';

import { actions as zenderActions, selectors as zenderSelectors } from 'zender-api-client';
import * as actions from '../actions';
import hello from 'hellojs';

class AuthBattle {

	constructor(config) {
		this.config = config;
		// Hellojs config
		const appId = '1855557271371563';
		hello.init({ facebook: appId }, { redirect_uri: './' });
		// saga definitions
		this.loginSaga = this.createLoginSaga();
		this.logoutSaga = this.createLogoutSaga();
		// listener definitions
		this.loginListener = this.createLoginListener();
		this.logoutListener = this.createLogoutListener();
	}

	createLoginSaga() {
		const generator = function* login() {
			const config = yield select(zenderSelectors.channel.configSelector);
			const providers = config.auth.providers;
			if (providers && providers.facebook) {
				const auth = yield hello('facebook').login();
				const token = auth.authResponse.access_token;
				yield put(zenderActions.auth.uiActions.login({ provider: 'facebook', token }));
			}
			else {
				console.warn('No Facebook provider in config!');
			}
		};
		return generator.bind(this);
	}

	createLogoutSaga() {
		const generator = function* logout() {
			const config = yield select(zenderSelectors.channel.configSelector);
			const providers = config.auth.providers;
			if (providers && providers.facebook) {
				yield hello('facebook').logout();
				yield put(zenderActions.auth.uiActions.resetToken());
				const targetId = yield select(zenderSelectors.target.idSelector);
				yield put(zenderActions.auth.uiActions.login({ targetId }));
			}
			else {
				console.warn('No Facebook provider in config!');
			}
		};
		return generator.bind(this);
	}

	createLoginListener() {
		const listener = function* loginListener() {
			yield takeEvery(actions.authBattle.uiActionTypes.LOGIN, this.loginSaga);
		};
		return listener.bind(this);
	}

	createLogoutListener() {
		const listener = function* logoutListener() {
			yield takeEvery(actions.authBattle.uiActionTypes.LOGOUT, this.logoutSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.loginListener),
			fork(this.logoutListener),
		];
	}
}

export default AuthBattle;
