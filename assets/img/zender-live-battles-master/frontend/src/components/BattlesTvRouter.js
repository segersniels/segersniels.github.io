import React from 'react';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import BattlesTv from './BattlesTv';
import Overview from './Overview/Overview';
import Battle from './Battle';
import NoMatch from './Common/NoMatch';

let routes = {
	path: '',
	component: BattlesTv,
	childRoutes: [
		{ path: '/', component: Overview },
		{ path: '/battle/:battleId/:sessionId', component: Battle },
		{ path: '*', component: NoMatch}
	]
};

const BattlesTvRouter = ({ store }) =>  {
	let history = syncHistoryWithStore(browserHistory, store);
	return (
		<Router history={history} routes={routes}></Router>
	);
}		

export default BattlesTvRouter;