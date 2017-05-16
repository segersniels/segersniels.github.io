import forEach from 'lodash/fp/forEach';
import filter from 'lodash/fp/filter';

class Dispatcher {

	callbacks = {}

	on(event, callback) {
		if (!this.callbacks[event]) {
			this.callbacks[event] = [];
		}
		this.callbacks[event].push(callback);
	}

	trigger(event, data) {
		this._dispatch(event, data);
	}

	remove(event, callback) {
		const chain = this.callbacks[event];
		if (chain) {
			this.callbacks[event] = filter(cb => cb !== callback, chain);
		}
	}

	_dispatch(event, data) {
		const chain = this.callbacks[event];
		if (chain) {
			forEach(callback => callback(data), chain);
		}
	}
}

export default Dispatcher;
