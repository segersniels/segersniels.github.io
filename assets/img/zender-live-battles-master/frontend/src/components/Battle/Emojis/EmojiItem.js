import React from 'react';

const EmojiItem = ({ emoji, onEmojiClick}) => (
	<div className="emojiList__item">
		<img src={emoji.url} alt={emoji.title} onClick={() => onEmojiClick(emoji)} />
	</div>
);

export default EmojiItem;