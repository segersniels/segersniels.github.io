# Zender-live-battles - Backend

## Table of Contents
* [Intro](#intro)
* [Stack](#stack)
* [Battles](#battles)
* [Sessions](#sessions)

## Intro

This RESTfull api is used for maintaining the dynamodb database used by Battles.tv. In this database, you can find all battles and their sessions. Each battles is linked to a single Zender live stream in which media, emojis and chat can be found and moderated.

## Stack

This API was build using Nodejs in combination with:

* [Koajs](http://koajs.com/)
* [Pusher](https://pusher.com/)

and tested with:

* [Mocha](https://mochajs.org/)

## Battles

### Routes

The API has following routes for managing battles:

|	Method		|	Route						|	Function			|
| -------------	| ----------------------------- | --------------------- |
|	**GET** 	|	/battles/get				|	Get all battles		|
|	**GET**		|	/battles/:battleId			|	Get battle by id	|
|	**POST**	|	/battles/create				|	Create a battle		|
|	**PUT**		|	/battles/update/:battleId	|	Update battle by id	|
|	**DELETE**	|	/battles/delete/:battleId	|	Delete battle by id	|

### Properties

Every battle contains following properties:

* **id**
* **streamId**: Id of Zender live stream
* **sessionId**: Id of public session
* **info**:
	* **league**
* **choice (x2)**:
	* **choiceName**: Name of the choice
	* **short**: Abbreviation of choiceName
	* **avatar**: Choice avatar
	* **score**: Hardcoded score
	* **color**: RGB-object for choice color
* **createdAt**: Date of creation

### Structure

```json
{
	"id": "some-id",
	"streamId": "some-streamId",
	"sessionId": "some-sessionId",
	"info": {
		"league": "some-league"
	},
	"choice1": {
		"choiceName": "some-name",
		"short": "some-short",
		"avatar": "some-avatar",
		"score": "some-score",
		"color": {
			"r": 0,
			"g": 0,
			"b": 0,
		},
	},
	"choice2": {
		"choiceName": "some-name",
		"short": "some-short",
		"avatar": "some-avatar",
		"score": "some-score",
		"color": {
			"r": 0,
			"g": 0,
			"b": 0,
		},
	},
	"createdAt": "some-date"
}
```

## Sessions

### Types

Sessions can be split up into 2 types:

* **Public**: Publicly accessible session, is created by default on creation of a battle.
* **Private**: Private session only accessible on invite (via shared url). Chat in this session is seperated from the chat in the public session.

> **Note** - Emojis will be visible in every session since every battle is linked with a single Zender live stream. Chat will follow user when changing sessions from the same battle for the same reason.

### Routes

The API has following routes for managing sessions:

|	Method		|	Route										| Function						|
| -------------	| ---------------------------------------------	| -----------------------------	|
|	**GET** 	|	/battles/sessions/get						|	Get all sessions			|
|	**GET**		|	/battles/sessions/:sessionId				|	Get session by id			|
|	**POST**	|	/battles/sessions/create					|	Create a session			|
|	**DELETE**	|	/battles/sessions/delete/:sessionId			|	Delete session by id		|
|	**PUT**		|	/battles/sessions/update/:sessioId 			|	Add user to session			|
|	**DELETE**	|	/battles/sessions/delete/:sessionId/:userId	|	Remove user from session 	|

### Properties

Every session is linked with a battle and contains following properties:

* **id**
* **battle**: Id of battle
* **choice (x2)**: Array containing userId's for choice
* **createdAt**: Date of creation

### Structure

```json
{
	"id": "some-id",
	"battleId": "some-battleId",
	"choice1": [
		"some-userId", "another-userId"
	],
	"choice2": [
		"some-userId", "another-userId"
	],
	"createdAt": "some-date"
}
```
