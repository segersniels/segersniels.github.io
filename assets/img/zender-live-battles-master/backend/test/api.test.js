const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('lodash');

const API = require('../src/lib/api');
const config = require('../src/config');

describe('API test', () => {

	var api = {};
	var battleId, sessionId;

	/**
	 *	General
	 *	-------
	 */

	it('create api instance and load config', () => {
		api = new API(config);

		const actual = api.config;
		const expected = config;

		expect(actual).to.eql(expected);
	});

	it('create new battles table', function *() {
		yield api.deleteBattleTable();
		const table = yield api.createBattleTable();
		expect(table.TableDescription).to.have.property('TableName').and.to.equal(process.env.BATTLE_TABLE);
		expect(table.TableDescription).to.have.property('ItemCount').and.to.equal(0);
	});

	it('create new sessions table', function *() {
		yield api.deleteSessionTable();
		const table = yield api.createSessionTable();
		expect(table.TableDescription).to.have.property('TableName').and.to.equal(process.env.SESSION_TABLE);
		expect(table.TableDescription).to.have.property('ItemCount').and.to.equal(0);
	});

	/**
	 *	Battles
	 *	-------
	 */

	it('create battle', function *() {
		const battle = {
			league: 'some-league',
			category: 'some-category',
			choice_1_name: 'some-choice-1',
			choice_1_avatar: 'some-avatar-1',
			choice_1_color: { r: 0, g: 0, b: 0 },
			choice_1_short: 'some-short-name',
			choice_1_score: 0,
			choice_2_name: 'some-choice-2',
			choice_2_avatar: 'some-avatar-2',
			choice_2_color: { r: 255, g: 255, b: 255},
			choice_2_short: 'some-short-name',
			choice_2_score: 0,
			streamId: 'some-streamId',
		};
		created_battle = yield api.createBattle(null, battle);
		battleId = created_battle.battleId;
		sessionId = created_battle.sessionId;
		const inserted_battle = yield api.getBattle(null, battleId);
		const actual = _.omit(inserted_battle, ['createdAt']);
		const expected = {
			'id': battleId,
			'info': {
				'league': 'some-league',
				'category': 'some-category'
			},
			'choice1': {
				'choiceName': 'some-choice-1',
				'avatar': 'some-avatar-1',
				'color': { r: 0, g: 0, b: 0 },
				'short': 'some-short-name',
				'score': 0
			},
			'choice2': {
				'choiceName': 'some-choice-2',
				'avatar': 'some-avatar-2',
				'color': { r: 255, g: 255, b: 255},
				'short': 'some-short-name',
				'score': 0
			},
			'streamId': 'some-streamId',
			'sessionId': sessionId
		};

		expect(actual).to.eql(expected);
	});

	it('update battle - all info present', function *() {
		const update = {
			league: 'some-new-league',
			category: 'some-new-category',
			choice_1_name: 'some-new-choice-1',
			choice_1_avatar: 'some-new-avatar-1',
			choice_1_color: { r: 255, g: 255, b: 255},
			choice_1_short: 'some-new-short-name',
			choice_1_score: 1,
			choice_2_name: 'some-new-choice-2',
			choice_2_avatar: 'some-new-avatar-2',
			choice_2_color: { r: 0, g: 0, b: 0 },
			choice_2_short: 'some-new-short-name',
			choice_2_score: 2
		};

		const actual = yield api.updateBattle(null, battleId, update);

		const expected = {
			'id': battleId,
			'info': {
				'league': 'some-new-league',
				'category': 'some-new-category'
			},
			'choice1': {
				'choiceName': 'some-new-choice-1',
				'avatar': 'some-new-avatar-1',
				'color': { r: 255, g: 255, b: 255},
				'short': 'some-new-short-name',
				'score': 1
			},
			'choice2': {
				'choiceName': 'some-new-choice-2',
				'avatar': 'some-new-avatar-2',
				'color': { r: 0, g: 0, b: 0 },
				'short': 'some-new-short-name',
				'score': 2
			},
			'streamId': 'some-streamId',
			'sessionId': sessionId
		};

		expect(_.omit(actual.Attributes, ['createdAt'])).to.eql(expected);
	});

	it('delete battle', function *() {
		yield api.deleteBattle(null, battleId);

		const actual = yield api.getBattle(null, battleId);
		const expected = {};

		expect(actual).to.eql(expected);
	});

	it('check if session got deleted when battle was deleted', function *(){
		const data = yield api.getAllSessionsFromBattle(null, battleId);
		const actual = data.Count;
		const expected = 0;
		expect(actual).to.eql(expected);
	});

	it('add 3 random battles', function *() {
		const battle = {
			league: 'some-league',
			category: 'some-category',
			choice_1_name: 'some-choice-1',
			choice_1_avatar: 'some-avatar-1',
			choice_2_name: 'some-choice-2',
			choice_2_avatar: 'some-avatar-2'
		};

		for (var i = 0; i < 3; i++) {
			yield api.createBattle(null, battle);
		}

		const battles = yield api.getAllBattles();

		expect(battles).to.have.property('Count').and.to.equal(3);
	});

	it('try delete non-existing battles table', (done) => {
		const collect = _.after(2, () => {
			done();
		});
		api.deleteBattleTable().then(collect).catch((err) => console.log(err));
		api.deleteBattleTable().then(collect).catch((err) => console.log(err));
	});

	/**
	 *	Sessions
	 *	--------
	 */

	it('create new session', function *() {
		const session = {
			'battleId': 'some-battle-id'
		}
		const response = yield api.createSession(null, session);
		sessionId = response.id;
		const inserted_session = yield api.getSession(null, sessionId);
		const actual = _.omit(inserted_session, ['createdAt']);
		const expected = {
			'id': sessionId,
			'choice1': [],
			'choice2': [],
			'battleId': 'some-battle-id'
		};
		expect(actual).to.eql(expected);
	});

	it('adding 3 choices to session', function *() {
		const update1 = {
			'userId': 'some-user-id-1',
			'choice': 1
		};

		const update2 = {
			'userId': 'some-user-id-2',
			'choice': 1
		};

		const update3 = {
			'userId': 'some-user-id-3',
			'choice': 2
		};
		yield api.addUserToSession(null, sessionId, update1);
		yield api.addUserToSession(null, sessionId, update2);
		yield api.addUserToSession(null, sessionId, update3);
		const updated_session = yield api.getSession(null,sessionId);
		const actual = _.omit(updated_session, ['createdAt']);
		const expected = {
			'id': sessionId,
			'choice1': ['some-user-id-1', 'some-user-id-2'],
			'choice2': ['some-user-id-3'],
			'battleId': 'some-battle-id'
		}
		expect(actual).to.eql(expected);
	});

	it('remove user from session', function *() {
		const userId = 'some-user-id-2';
		yield api.deleteUserFromSession(null, sessionId, userId);
		const updated_session = yield api.getSession(null,sessionId);
		const actual = _.omit(updated_session, ['createdAt']);
		const expected = {
			'id': sessionId,
			'choice1': ['some-user-id-1'],
			'choice2': ['some-user-id-3'],
			'battleId': 'some-battle-id'
		}
		expect(actual).to.eql(expected);
	});

	it('delete session', function *() {
		yield api.deleteSession(null, sessionId);
		const actual = yield api.getSession(null, sessionId);
		const expected = {};
		expect(actual).to.eql(expected);
	});

	it('try delete non-existing sessions table', (done) => {
		const collect = _.after(2, () => {
			done();
		});
		api.deleteSessionTable().then(collect).catch((err) => console.log(err));
		api.deleteSessionTable().then(collect).catch((err) => console.log(err));
	});

	/**
	 *	Clean-up
	 *	--------
	 */

	after(function *() {
		// Delete
		yield api.deleteBattleTable();
		yield api.deleteSessionTable();

		// Create
		yield api.createBattleTable();
		yield api.createSessionTable();
	});
});
