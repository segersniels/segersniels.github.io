import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import Pusher from 'pusher-js';
import { ZenderApi } from 'zender-api-client';

import * as reducers from './reducers';
import initSagas from './sagas';

import BattlesTvRouter from './components/BattlesTvRouter';
import Spinner from './components/Common/Spinner';

class BattlesTvApp extends Component {
	constructor(props) {
		super(props);
		this.state = { ready: false };
	}

	componentWillMount() {
		const config = this.getConfig();
		const sagaListeners = this.getSagas(config);
		const options = this.getOptions(sagaListeners);

		const zenderApi = new ZenderApi(config, options);
		zenderApi.init(() => {
			this.zenderApi = zenderApi;
			this.setState({ ready: true });
		});
	}

	getConfig() {
		const config = {
			apiUrl: process.env.REACT_APP_API_URL,
			channelsRoot: process.env.REACT_APP_CHANNEL_ROOT,
			targetId: '94b89e15-fdf9-4ba0-8b4b-fc933ba7269a',
			channelId: '57c6a5f3-f05f-4dc3-9c97-b8f87909f07e',
			pusher: Pusher,
			native: false,
			meta: {
				maxShoutsInMemory: 30
			},
		};
		return config;
	}

	getSagas(config) {
		const listeners = [];
		const sagas = initSagas(config);
		if(sagas.authBattle) {
			listeners.push(...sagas.authBattle.createListeners());
		}
		if(sagas.battle) {
			listeners.push(...sagas.battle.createListeners());
		}
		if(sagas.pusher) {
			listeners.push(...sagas.pusher.createListeners());
		}
		if(sagas.session) {
			listeners.push(...sagas.session.createListeners());
		}
		if(sagas.sticker) {
			listeners.push(...sagas.sticker.createListeners());
		}
		if(sagas.ui) {
			listeners.push(...sagas.ui.createListeners());
		}
		return listeners;
	}

	getOptions(sagaListeners) {
		return {
			reducers: {
				routing: routerReducer,
				...reducers, 
			},
			sagas: [...sagaListeners],
			middleware: [routerMiddleware(browserHistory)],
		};
	}

	render() {
		const { ready } = this.state;
		if(!ready) {
			return (
				<Spinner />
			);
		}
		else {
			const store = this.zenderApi.getStore();
			return (
				<Provider store={store}>
					<BattlesTvRouter store={store} />
				</Provider>
			);
		}
	}
}

export default BattlesTvApp;