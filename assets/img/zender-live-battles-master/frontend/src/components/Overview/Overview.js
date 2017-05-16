import React from 'react';
import { connect } from 'react-redux';

import Header from './Header/Header';
import Banner from './Banner/Banner';
import BattleList from './BattleList/BattleList';

import * as selectors from './../../selectors';

const OverviewPresentational = ({ battles }) => (
	<div>
		<Header />
		<Banner />
		<BattleList battles={ battles } />
	</div>
);

const mapStateToProps = (state) => {
	return { 
		battles: selectors.battle.battlesSelector(state),
	};
}
const Overview = connect(
	mapStateToProps,
	null
)(OverviewPresentational);

export default Overview;