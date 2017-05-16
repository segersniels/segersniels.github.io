import { createSelector } from 'reselect';

export const statusSelector = createSelector(
	state => state.battle.status,
	status => status,
);

export const isLoadingSelector = createSelector(
	state => state.battle.isLoading || false,
	isLoading => isLoading,
);

export const battlesSelector = createSelector(
	state => state.battle.data || [],
	battles => battles,
);