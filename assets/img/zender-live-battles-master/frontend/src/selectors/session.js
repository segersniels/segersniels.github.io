import { createSelector } from 'reselect';

export const isLoadingSelector = createSelector(
	state => state.session.isLoading || false,
	isLoading => isLoading,
);

export const sessionSelector = createSelector(
	state => state.session.data || {},
	data => data,
);

export const sessionIdSelector = createSelector(
	(state) => {
		if (state.session.data.id) {
			return state.session.data.id;
		}
		return undefined;
	},
	sessionId => sessionId,
);