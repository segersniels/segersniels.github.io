import React from 'react';
import isEmpty from 'lodash/isEmpty';

const CurrentEmoji = ({ currentEmoji }) => (
	<div>
		{ 
			!isEmpty(currentEmoji) &&
			<img className="currentEmoji" src={currentEmoji.url} alt="Current emoji" />
		}
	</div>
);

export default CurrentEmoji;