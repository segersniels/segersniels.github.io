import request from 'superagent';

export const apiRequest = (options = {}) => {
	const headers = {
		Accept: 'application/json',
	};
	if (options.token) {
		headers.Authorization = `Bearer ${options.token}`;
	}
	const p = new Promise((resolve) => {
		const r = request[options.method](options.url);
		r.set(headers);
		if (options.query) {
			r.query(options.query);
		}
		if (options.body) {
			r.type('json');
			r.send(options.body);
		}
		if (options.file) {
			r.attach('file', options.file, options.file.name);
			r.on('progress', (e) => {
				if (options.progressDispatcher) {
					options.progressDispatcher.trigger('progress',
						{ file: options.file, progress: e.percent });
				}
			});
		}
		r.end((err, response) => {
			if (err) {
				const error = { ...err, isError: true };
				resolve(error);
			} else if (options.responseHandler) {
				const responseBody = response.body || {};
				resolve(options.responseHandler(responseBody));
			} else {
				resolve(response.body || {});
			}
		});
	});
	return p;
};

class API {

	constructor(config) {
		this.config = config;
	}

	addBattle() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/create`;
			const method = 'post';
			const options = {
				method,
				url,
				body: requestOptions.battle,
			};
			return apiRequest(options);
		};
	}

	createSession() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/sessions/create`;
			const method = 'post';
			const options = {
				method,
				url,
				body: requestOptions,
			};
			return apiRequest(options);
		};
	}

	deleteBattle() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/delete/${requestOptions.battleId}`;
			const method = 'delete';
			const options = {
				method,
				url,
			};
			return apiRequest(options);
		};
	}

	getBattles() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/get`;
			const method = 'get';
			const options = {
				method,
				url,
			};
			return apiRequest(options);
		};
	}

	getSession() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/sessions/${requestOptions.sessionId}`;
			const method = 'get';
			const options = {
				method,
				url,
			};
			return apiRequest(options);
		};
	}	

	joinSession() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/sessions/update/${requestOptions.sessionId}`;
			const method = 'put';
			const options = {
				method,
				url,
				body: requestOptions,
			};
			return apiRequest(options);
		};
	}

	leaveSession() {
		return (requestOptions) => {
			const url = `${this.config.apiUrl}/battles/sessions/delete/${requestOptions.sessionId}/${requestOptions.userId}`;
			const method = 'delete';
			const options = {
				method,
				url,
			};
			return apiRequest(options);
		};
	}
}

export default API;
