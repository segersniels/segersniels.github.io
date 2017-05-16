import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import { selectors } from 'zender-api-client';

export const setCountersSelector = (state) => {
	// Get sets, current emoji counters
	const sets = selectors.emojis.setsSelector(state);
	const emojiCounters = {};
	const state_counters = selectors.emojis.emojisCountersSelector(state);
	keys(state_counters).forEach(c => emojiCounters[c] = state_counters[c].count);

	// Prepare setcounters
	const initSetCounters = sets.reduce((result, set) => {
		result[set.id] = 0;
		return result;
	}, {});

	// Count emoji per set
	const setCounters = keys(emojiCounters).reduce((counters, emoji) => {
		sets.forEach(s => {
			const isInSet = s.emojis.filter((e) => e.id === emoji).length > 0;
			if(isInSet) counters[s.id] += emojiCounters[emoji];
		});
		return counters;
	}, initSetCounters);

	return setCounters;
};

export const emojisCountersSelector = (state) => {
	const counters = {};
	const state_counters = selectors.emojis.emojisCountersSelector(state);
	keys(state_counters).forEach(emoji => counters[emoji] = state_counters[emoji].count);
	return counters;
};

export const mediaSelector = (state) => {
	const media = selectors.media.contentSelector(state);
	if(isEmpty(media)) {
		return { type: 'NULL', url: '' };
	}
	else {
		if(!isEmpty(media.view.image)) {
			return { type: 'IMAGE', url: media.view.image.url };
		}
		else if(!isEmpty(media.view.video)) {
			return { type: 'VIDEO', url: media.view.video.url };
		}			
	}
};

export const mostUsedEmojiSelector = (state) => {
	const counters = selectors.emojis.emojisCountersSelector(state);
	const cdnHost = selectors.emojis.cdnHostSelector(state);
	var maxEmoji = { count: 0 };
	keys(counters).forEach(c => {
		if(counters[c].count > maxEmoji.count) {
			maxEmoji = counters[c];
			maxEmoji.url = cdnHost + c;
		}
	});
	return maxEmoji;
};
