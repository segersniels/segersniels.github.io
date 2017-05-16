const Router = require('koa-router');
const API = require('./lib/api');

// Load config
const env = process.env.API_ENV;
const config = (env === 'PRODUCTION') ? require('./config-production') : require('./config');

const router = new Router();
const api = new API(config);
const apiPrefix = config.server.apiRoutePrefix;

router.get(`${apiPrefix}/battles/get`, function *(next) {
	this.body = yield api.getAllBattles(this.request.headers);
});

router.post(`${apiPrefix}/battles/create`, function *(next) {
	this.body = yield api.createBattle(this.request.headers, this.request.body);
});

router.get(`${apiPrefix}/battles/:battleId`, function *(next) {
	this.body = yield api.getBattle(this.request.headers, this.params.battleId);
});

router.put(`${apiPrefix}/battles/update/:battleId`, function *(next) {
	this.body = yield api.updateBattle(this.request.headers, this.params.battleId, this.request.body);
});

router.delete(`${apiPrefix}/battles/delete/:battleId`, function *(next) {
	this.body = yield api.deleteBattle(this.request.headers, this.params.battleId);
});

router.get(`${apiPrefix}/battles/sessions/get`, function *(next) {
	this.body = yield api.getAllSessions(this.request.headers);
});

router.get(`${apiPrefix}/battles/sessions/:sessionId`, function *(next){
	this.body = yield api.getSession(this.request.headers, this.params.sessionId);
});

router.post(`${apiPrefix}/battles/sessions/create`, function *(next){
	this.body = yield api.createSession(this.request.headers, this.request.body);
});

router.delete(`${apiPrefix}/battles/sessions/delete/:sessionId`, function *(next){
	this.body = yield api.deleteSession(this.request.headers, this.params.sessionId);
});

router.put(`${apiPrefix}/battles/sessions/update/:sessionId`, function *(next) {
	this.body = yield api.addUserToSession(this.request.headers, this.params.sessionId, this.request.body);
});

router.delete(`${apiPrefix}/battles/sessions/delete/:sessionId/:userId`, function *(next){
	this.body = yield api.deleteUserFromSession(this.request.headers, this.params.sessionId, this.params.userId);
});

module.exports = router;
