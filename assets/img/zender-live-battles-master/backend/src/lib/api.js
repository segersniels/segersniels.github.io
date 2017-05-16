'use strict'

const AWS = require('aws-sdk');
const uuidV1 = require('uuid/v1');
const _ = require('lodash');
const Pusher = require('pusher');
const async = require('async');

class API {

	constructor(config) {
		this.config = config || {};

		this.dynamodb = new AWS.DynamoDB(this.config.aws);
		this.store = new AWS.DynamoDB.DocumentClient(this.config.aws);
		this.pusher = new Pusher(this.config.pusher);
	}

	/**
	 *	Battles
	 *	-------
	 */

	createBattleTable() {
		const params = {
			TableName : process.env.BATTLE_TABLE,
			KeySchema: [
				{ AttributeName: "id", KeyType: "HASH" }
			],
			AttributeDefinitions: [
				{ AttributeName: "id", AttributeType: "S" }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			}
		};

		return this.dynamodb.createTable(params).promise();
	}

	deleteBattleTable() {
		const params = {
			TableName: process.env.BATTLE_TABLE
		};

		return new Promise((resolve, reject) => {
			this.dynamodb.deleteTable(params, (err, result) => {
				if(err && err.code !== 'ResourceNotFoundException') reject(err);
				else resolve(result);
			});
		});
	}

	getAllBattles(headers) {
		const params = {
			TableName: process.env.BATTLE_TABLE,
			Limit: 10
		};

		return this.store.scan(params).promise();
	}

	*createBattle(headers, body) {
		const id = uuidV1();
		const session = {
			'battleId': id
		};
		const response = yield this.createSession(null, session);
		const sessionId = response.id;

		const {
			league,
			category,
			choice_1_name,
			choice_1_avatar,
			choice_1_color,
			choice_1_short,
			choice_1_score,
			choice_2_name,
			choice_2_avatar,
			choice_2_color,
			choice_2_short,
			choice_2_score,
			streamId,
		 } = body;
		const createdAt = new Date().toISOString();

		const battle = {
			id,
			info: {
				league,
				category
			},
			choice1: {
				choiceName: choice_1_name,
				avatar: choice_1_avatar,
				color: choice_1_color,
				short: choice_1_short,
				score: choice_1_score
			},
			choice2: {
				choiceName: choice_2_name,
				avatar: choice_2_avatar,
				color: choice_2_color,
				short: choice_2_short,
				score: choice_2_score
			},
			streamId,
			sessionId,
			createdAt
		};

		const params = {
			TableName: process.env.BATTLE_TABLE,
			Item: battle
		};

		return new Promise((resolve, reject) => {
			this.store.put(params, (err, result) => {
				if(err) reject(err);
				else {
					this.pusher.trigger('battles', 'battle-add', battle);
					resolve({ battleId: id, sessionId: sessionId });
				}
			});
		});
	}

	getBattle(headers, battleId) {
		const params = {
			TableName : process.env.BATTLE_TABLE,
			KeyConditionExpression: '#id = :battle_id',
			ExpressionAttributeNames: {
				'#id': 'id'
			},
			ExpressionAttributeValues: {
				':battle_id': battleId
			}
		};

		return new Promise((resolve, reject) => {
			this.store.query(params, (err, result) => {
				if(err) reject(err);
				else {
					_.isEmpty(result.Items) ? resolve({}) : resolve(result.Items[0]);
				}
			});
		});
	}

	updateBattle(headers, battleId, body) {
		const info = {
			league: body.league,
			category: body.category
		};
		const choice1 = {
			choiceName: body.choice_1_name,
			avatar: body.choice_1_avatar,
			color: body.choice_1_color,
			short: body.choice_1_short,
			score: body.choice_1_score
		};
		const choice2 = {
			choiceName: body.choice_2_name,
			avatar: body.choice_2_avatar,
			color: body.choice_2_color,
			short: body.choice_2_short,
			score: body.choice_2_score
		};

		const params = {
			TableName: process.env.BATTLE_TABLE,
			Key: {
				'id': battleId
			},
			UpdateExpression: 'set info = :i, choice1 = :c1, choice2 = :c2',
			ExpressionAttributeValues: {
				':i': info,
				':c1': choice1,
				':c2': choice2
			},
			ReturnValues:"ALL_NEW"
		};

		return this.store.update(params).promise();
	}

	*deleteBattle(headers, battleId) {
		const params = {
			TableName: process.env.BATTLE_TABLE,
			Key: {
				'id': battleId
			}
		}

		yield this.deleteSessionsOnBattleDelete(null, battleId);
		return new Promise((resolve, reject) => {
			this.store.delete(params, (err, result) => {
				if(err) reject(err);
				else {
					this.pusher.trigger('battles', 'battle-delete', { id: battleId });
					resolve({});
				}
			});
		});
	}

	/**
	 *	Sessions
	 *	--------
	 */

	createSessionTable() {
		const params = {
			TableName : process.env.SESSION_TABLE,
			KeySchema: [
				{ AttributeName: "id", KeyType: "HASH" }
			],
			AttributeDefinitions: [
				{ AttributeName: "id", AttributeType: "S" },
				{ AttributeName: "battleId", AttributeType: "S" }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			},
	        GlobalSecondaryIndexes: [{
	            IndexName: "BattleIndex",
	            KeySchema: [
	                {
	                    AttributeName: "battleId",
	                    KeyType: "HASH"
	                }
	            ],
	            Projection: {
	                ProjectionType: "ALL"
	            },
	            ProvisionedThroughput: {
	                ReadCapacityUnits: 1,
	                WriteCapacityUnits: 1
	            }
	        }]
		};

		return this.dynamodb.createTable(params).promise();
	}

	deleteSessionTable() {
		const params = {
			TableName: process.env.SESSION_TABLE
		};

		return new Promise((resolve, reject) => {
			this.dynamodb.deleteTable(params, (err, result) => {
				if(err && err.code !== 'ResourceNotFoundException') reject(err);
				else resolve(result);
			});
		});
	}

	getAllSessions(headers) {
		const params = {
			TableName: process.env.SESSION_TABLE,
			Limit: 20
		};

		return this.store.scan(params).promise();
	}

	createSession(headers, body) {
		const id = uuidV1();
		const choice1 = [];
		const choice2 = [];
		const battleId = body.battleId;
		const createdAt = new Date().toISOString();

		const params = {
			TableName: process.env.SESSION_TABLE,
			Item: {
				id: id,
				choice1: choice1,
				choice2: choice2,
				battleId,
				createdAt
			}
		}

		return new Promise((resolve, reject) => {
			this.store.put(params, (err, result) => {
				if(err) reject(err);
				else resolve({ id });
			});
		});
	}

	getSession(headers, sessionId) {
		const params = {
			TableName: process.env.SESSION_TABLE ,
			KeyConditionExpression: '#id = :session_id',
			ExpressionAttributeNames: {
				'#id': 'id'
			},
			ExpressionAttributeValues: {
				':session_id': sessionId
			}
		}

		return new Promise((resolve, reject) => {
			this.store.query(params, (err,data) => {
				if(err) reject(err);
				else _.isEmpty(data.Items) ? resolve({}) : resolve(data.Items[0]);
			});
		});
	}

	deleteSession(headers, sessionId) {
		const params = {
			TableName: process.env.SESSION_TABLE,
			Key:{
				'id': sessionId
			}
		}

		return this.store.delete(params).promise();
	}

	*addUserToSession(headers, sessionId, body) {
		const userId = body.userId;
		const choice = body.choice;

		// Check if user joined session already and remove from choices if so
		yield this.deleteUserFromSession(null, sessionId, userId, false);

		var params = null;
		if(choice === 1) {
			params = {
				TableName: process.env.SESSION_TABLE,
				Key:{
					'id': sessionId
				},
				UpdateExpression: 'set choice1 = list_append(choice1,:c1)',
				ExpressionAttributeValues: {
					':c1': [userId]
				},
				ReturnValues: 'ALL_NEW'
			}
		}
		else {
			params = {
				TableName: process.env.SESSION_TABLE,
				Key:{
					'id': sessionId
				},
				UpdateExpression: 'set choice2 = list_append(choice2,:c2)',
				ExpressionAttributeValues: {
					':c2': [userId]
				},
				ReturnValues: 'ALL_NEW'
			}
		}

		return new Promise((resolve, reject) => {
			this.store.update(params, (err,data) => {
				if(err) reject(err);
				else {
					const choice1 = data.Attributes.choice1;
					const choice2 = data.Attributes.choice2;
					this.pusher.trigger(`session-${sessionId}`, 'session-join', { choice1, choice2 });
					resolve(data);
				}
			});
		});
	}

	*deleteUserFromSession(headers, sessionId, userId, trigger=true) {
		const session = yield this.getSession(null, sessionId);
		const choice1 = session.choice1;
		const choice2 = session.choice2;
		const index1 = choice1.indexOf(userId);
		const index2 = choice2.indexOf(userId);
		if(index1 !== -1) choice1.splice(index1, 1);
		if(index2 !== -1) choice2.splice(index2, 1);

		const params = {
			TableName: process.env.SESSION_TABLE,
			Key:{
				'id': sessionId
			},
			UpdateExpression: 'set choice1 = :c1, choice2 = :c2',
			ExpressionAttributeValues: {
				':c1': choice1,
				':c2': choice2
			},
			ReturnValues: 'ALL_NEW'
		}

		return new Promise((resolve, reject) => {
			this.store.update(params, (err,data) => {
				if(err) reject(err);
				else {
					const choice1 = data.Attributes.choice1;
					const choice2 = data.Attributes.choice2;
					if(trigger) this.pusher.trigger(`session-${sessionId}`, 'session-leave', { choice1, choice2 });
					resolve(data);
				}
			});
		});
	}

	*deleteSessionsOnBattleDelete(headers, battleId){
		const sessions = yield this.getAllSessionsFromBattle(null, battleId);
        const ids = sessions.Items.map(i => i.id);
        const table = this.store;
        return new Promise((resolve, reject) => {
        	async.each(ids, function(id, callback) {
	            const paramsDelete = {
	                TableName: process.env.SESSION_TABLE,
	                Key: {
	                    "id": id
	                }
	            };
	            table.delete(paramsDelete, callback);
	        }, (err) => {
	            if(err) reject(err);
	            else resolve({});
	        });
        });
    }

    getAllSessionsFromBattle(headers, battleId){
    	const params = {
            TableName : process.env.SESSION_TABLE,
            IndexName: 'BattleIndex',
            KeyConditionExpression: 'battleId = :battle_id',
            ExpressionAttributeValues: {
                ':battle_id': battleId
            },
            ProjectionExpression: 'id',
            ScanIndexForward: false
        };

        return new Promise((resolve, reject) => {
        	this.store.query(params, (err, data) => {
        		if(err) reject(err);
        		else resolve(data);
        	});
        });
    }
}

module.exports = API;
