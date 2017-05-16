import React from 'react';
import { connect } from 'react-redux';

import * as selectors from './../../selectors';

import StickerImage from './../../../assets/goteam.png';

const StickerPresentational = ({ visibility }) => (
	<div className="sticker">
		{ visibility && <img src={StickerImage} alt="Sticker" /> }
	</div>
);

const mapStateToProps = (state) => {
	return { 
		visibility: selectors.sticker.visibilitySelector(state),
	};
}
const Sticker = connect(
	mapStateToProps,
	null
)(StickerPresentational);

export default Sticker;