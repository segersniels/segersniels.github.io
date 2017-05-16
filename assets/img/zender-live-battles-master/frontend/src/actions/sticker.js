import {
	createUiActionType,
	createUiAction,
} from './util';

export const uiActionTypes = {
	SET_STICKER: createUiActionType('STICKER/SET_STICKER'),
	UNSET_STICKER: createUiActionType('STICKER/UNSET_STICKER'),
};

export const uiActions = {
	setSticker: () => createUiAction(uiActionTypes.SET_STICKER),
	unsetSticker: () => createUiAction(uiActionTypes.UNSET_STICKER),
};