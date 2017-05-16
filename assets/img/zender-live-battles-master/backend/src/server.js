'use strict';

const koa = require('koa');
const app = koa();
const config = require('./config');
const router = require('./router');
const logger = require('koa-logger');

// Koa logger - Logging all requests
app.use(logger());

// Catch all error responses
app.use(function* (next) {
	try {
		yield next;
	} catch (err) {
		console.log('ERROR - ', err);
		err.message = err.expose ? err.message : 'Internal Server Error!';
		this.status = err.status || 500;
		this.body = { code: err.code, message: err.message, locale: err.locale };
	}
});

// Koa middleware
// Security headers middleware
app.use(function *(next) {
	this.set('Access-Control-Allow-Origin', '*');
	this.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	this.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Cache-Control, X-Requested-With');
	yield next;
});

// Include response time in headers
app.use(require('koa-response-time')());

// Parse request body
app.use(require('koa-bodyparser')({
	onerror: function (err, ctx) {
		ctx.throw('body parse error', 422);
	},
}));

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen(config.server.apiPortInternal);
