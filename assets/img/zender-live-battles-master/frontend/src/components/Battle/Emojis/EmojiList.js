import React from 'react';

import EmojiItem from './EmojiItem';

const EmojiList = ({ emojis, onEmojiClick }) => (
	<div className="emojiList">		
		{ emojis.map(emoji => <EmojiItem key={emoji.id} emoji={emoji} onEmojiClick={onEmojiClick} />) }
	</div>
);

export default EmojiList;