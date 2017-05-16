import { createSelector } from 'reselect';

export const visibilitySelector = createSelector(
	state => state.sticker.status || false,
	status => status,
);