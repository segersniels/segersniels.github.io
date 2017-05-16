import React from 'react';
import { Link } from 'react-router';

const NoMatch = () => (
	<div className="noMatch">
		<h1 className="noMatch__title">Oops euhm this is akward...</h1>
		<button className="button"><Link to="/">Take me back to safety</Link></button>
	</div>
);

export default NoMatch;
