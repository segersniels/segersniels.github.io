import { createSelector } from 'reselect';

export const streamReadySelector = createSelector(
	state => state.ui.streamReady || false,
	streamReady => streamReady,
);

export const battleSelector = createSelector(
	state => state.ui.battle || {},
	battle => battle,
);

export const choiceSelector = createSelector(
	state => state.ui.choice || {},
	choice => choice,
);

export const emojiSetSelector = createSelector(
	state => state.ui.emojiSet || [],
	emojiSet => emojiSet,
);

export const currentEmojiSelector = createSelector(
	state => state.ui.currentEmoji || {},
	currentEmoji => currentEmoji,
);

export const chatVisibilitySelector = createSelector(
	state => state.ui.chatVisibility || false,
	chatVisibility => chatVisibility,
);

export const emojiVisibilitySelector = createSelector(
	state => state.ui.emojiVisibility || false,
	emojiVisibility => emojiVisibility,
);

export const shareModalSelector = createSelector(
	state => state.ui.shareModalVisibility || false,
	shareModalVisibility => shareModalVisibility,
);