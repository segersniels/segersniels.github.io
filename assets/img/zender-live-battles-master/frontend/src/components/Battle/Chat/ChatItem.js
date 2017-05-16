import React from 'react';

const ChatItem = ({ shout, color }) => (
	<div className="chatItem">
		<div className="chatItem__color" style={{ backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`}}></div>
		{
			shout.type !== 'system' &&
				<div className="chatItem__avatar">
					<img className="chatItem__img" src={shout.user.avatar} alt={'profile_picture_' + shout.user.id} />
				</div>
		}
		<div className="chatItem__content">{shout.content.text}</div>
	</div>
);

export default ChatItem;
