import React from 'react';

import SpinnerImage from './../../../assets/spinner.png';

const Spinner = () => (
	<div className="spinner">
		<img className="spinner__img" src={SpinnerImage} alt="football_spinner" />
	</div>
);

export default Spinner;