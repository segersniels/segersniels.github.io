import forEach from 'lodash/forEach';
import { eventChannel } from 'redux-saga';
import { take, put, call, fork, select, takeEvery } from 'redux-saga/effects';
import { actions as zenderActions } from 'zender-api-client';

import Dispatcher from '../utils';
import * as actions from '../actions';
import * as selectors from '../selectors';

class PusherChannel {

	constructor(config) {
		this.config = config;
		this.dispatcher = new Dispatcher();
		this.battlesSubscription = {};
		this.sessionSubscription = {};

		// saga definitions
		this.initSaga = this.createInitSaga();
		this.subscribeBattlesSaga = this.createSubscribeBattlesSaga();
		this.unsubscribeBattlesSaga = this.createUnsubscribeBattlesSaga();
		this.subscribeSessionSaga = this.createSubscribeSessionSaga();
		this.unsubscribeSessionSaga = this.createUnsubscribeSessionSaga();
	}

	createInitSaga() {
		const generator = function* init() {
			const pusherConfig = {
				key: "f81e5f8eedf682808b8e",
				config: {
					cluster: 'eu',
					encrypted: true
				}
			};

			if (this.pusher) {
				this.destroy();
			}
			const Pusher = this.config.pusher;
			this.pusher = new Pusher(pusherConfig.key, pusherConfig.config);

			this.subscribeBattles();
			yield put(actions.battle.pushActions.subscribed());
		};
		return generator.bind(this);
	}

	createSubscribeBattlesSaga() {
		const generator = function* subscribeBattles() {
			this.subscribeBattles();
			yield put(actions.battle.pushActions.subscribed());
		};
		return generator.bind(this);
	}

	createUnsubscribeBattlesSaga() {
		const generator = function* unsubscribeBattles() {
			if(this.pusher) {
				this.pusher.unsubscribe(this.battlesSubscription.channel);
				yield put(actions.battle.pushActions.unsubscribed());
			}
		};
		return generator.bind(this);
	}

	createSubscribeSessionSaga() {
		const generator = function* subscribeSession() {
			const sessionId = yield select(selectors.session.sessionIdSelector);
			this.subscribeSession(sessionId);
			yield put(actions.session.pushActions.subscribed());
		};
		return generator.bind(this);
	}

	createUnsubscribeSessionSaga() {
		const generator = function* unsubscribeSession() {
			if(this.pusher) {
				this.pusher.unsubscribe(this.sessionSubscription.channel);
				yield put(actions.session.pushActions.unsubscribed());
			}
		};
		return generator.bind(this);
	}

	createInitListener() {
		const listener = function* initListener() {
			yield takeEvery(zenderActions.channel.apiActionTypes.GET_CHANNEL.SUCCESS, this.initSaga);
		};
		return listener.bind(this);
	}

	createChannelListener() {
		const pushChannel = dispatcher =>
			eventChannel((channelEmitter) => {
				const listener = data => channelEmitter(data);
				dispatcher.on('push', listener);
				// The subscriber must return an unsubscribe function
				return () => {
					dispatcher.remove('push', listener);
				};
			});

		const generator = function* channelListener() {
			const channel = yield call(pushChannel, this.dispatcher);
			while (true) {
				const payload = yield take(channel);
				const action = payload.action;
				yield put(action({
					channel: payload.channel,
					event: payload.event,
					data: payload.data,
				}, this.config.meta));
			}
		};
		return generator.bind(this);
	}

	createSubscribeBattlesListener() {
		const listener = function* subscribeBattlesListener() {
			yield takeEvery(zenderActions.channel.uiActionTypes.BOOTSTRAP, this.subscribeBattlesSaga);
		};
		return listener.bind(this);
	}

	createUnsubscribeBattlesListener() {
		const listener = function* unsubscribeBattlesListener() {
			yield takeEvery(zenderActions.channel.uiActionTypes.UNSUBSCRIBE, this.unsubscribeBattlesSaga);
		};
		return listener.bind(this);
	}

	createSubscribeSessionListener() {
		const listener = function* subscribeSessionListener() {
			yield takeEvery(actions.session.apiActionTypes.GET_SESSION.SUCCESS, this.subscribeSessionSaga);
		};
		return listener.bind(this);
	}

	createUnsubscribeSessionListener() {
		const listener = function* unsubscribeBattlesListener() {
			yield takeEvery(actions.session.apiActionTypes.LEAVE_SESSION.SUCCESS, this.unsubscribeSessionSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.createInitListener()),
			fork(this.createChannelListener()),
			fork(this.createSubscribeBattlesListener()),
			fork(this.createUnsubscribeBattlesListener()),
			fork(this.createSubscribeSessionListener()),
			fork(this.createUnsubscribeSessionListener()),
		];
	}

	subscribe(channel, eventActionMapping) {
		if (this.pusher) {
			const pusherChannel = this.pusher.subscribe(channel);
			forEach(eventActionMapping, (action, event) => {
				if (action) {
					pusherChannel.bind(event, data => {
						this.dispatcher.trigger('push', { channel, event, action, data });
					}
					);
				} else {
					console.warn(`Event to action mapping encountered without an action for event '${event}'!`);
				}
			});
		}
	}

	destroy() {
		if (this.pusher) {
			this.pusher.unsubscribe(this.battlesSubscription.channel);
			this.pusher.unsubscribe(this.sessionSubscription.channel);
			this.pusher.disconnect();
		}
	}

	trigger(channel, event, action, data) {
		this.dispatcher.trigger('push', { channel, event, action, data });
	}

	subscribeBattles() {
		const eventToActionMapping = {
			'battle-add': actions.battle.pushActions.battleAdd,
			'battle-delete': actions.battle.pushActions.battleDelete,
		};
		const channelName = 'battles';
		this.subscribe(channelName, eventToActionMapping);
		this.battlesSubscription = { module: 'battles', channel: channelName };
	}

	subscribeSession(sessionId) {
		const eventToActionMapping = {
			'session-join': actions.session.pushActions.sessionJoin,
			'session-leave': actions.session.pushActions.sessionLeave,
		};
		const channelName = `session-${sessionId}`;
		this.subscribe(channelName, eventToActionMapping);
		this.sessionSubscription = { module: 'session', channel: channelName };
	}
}

export default PusherChannel;
