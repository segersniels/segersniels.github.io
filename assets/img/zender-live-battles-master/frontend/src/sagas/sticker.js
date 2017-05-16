import { delay } from 'redux-saga'
import { fork, takeEvery, select, put } from 'redux-saga/effects';
import forEach from 'lodash/forEach';
import { actions as zenderActions } from 'zender-api-client';

import * as actions from '../actions';
import * as selectors from '../selectors';

class Sticker {

	constructor(config) {
		this.config = config;
		// saga definitions
		this.stickerSaga = this.createStickerSaga();
		// listener definitions
		this.stickerListener = this.createStickerListener();
		this.counterThresholds = {};
		this.stickerTrigger = 25;
	}

	createStickerSaga() {
		const generator = function* checkSticker(action) {
			const counters = yield select(selectors.zender.setCountersSelector);
			const status = yield select(selectors.sticker.visibilitySelector);
			var check = false;
			forEach(counters, (value, key) => {
				if(this.counterThresholds[key]) {
					// Check if new threshold was passed (instead of checking absolute value)
					if(value >= this.counterThresholds[key]) {
						check = true;
						this.counterThresholds[key] = (Math.floor(value / this.stickerTrigger) + 1) * this.stickerTrigger;
					}
				}
				else {
					// Set to next multiple of stickertrigger
					this.counterThresholds[key] = (Math.floor(value / this.stickerTrigger) + 1) * this.stickerTrigger;
				}
			});
			// Threshold was exceeded
			if(check && !status) {
				yield put(actions.sticker.uiActions.setSticker());
				yield delay(2000);
				yield put(actions.sticker.uiActions.unsetSticker());
			}

		};
		return generator.bind(this);
	}

	createStickerListener() {
		const listener = function* stickerListener() {
			yield takeEvery(zenderActions.emojis.pushActionTypes.EMOJIS_STATS, this.stickerSaga);
		};
		return listener.bind(this);
	}

	createListeners() {
		return [
			fork(this.stickerListener),
		];
	}
}

export default Sticker;
