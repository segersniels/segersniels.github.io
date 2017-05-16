import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import CopyToClipboard  from 'react-copy-to-clipboard';

import * as actions from './../../../actions';
import * as selectors from './../../../selectors';

class ShareModalPresentational extends Component {
	render() {
		const { visibility, onCopyClick } = this.props;
		const url = window.location.href;

		if(!visibility) return null;
		else {
			return (
				<ReactModal
					isOpen={visibility}
					contentLabel="Share this session!"
					className="ShareModal"
					overlayClassName="ShareModal__overlay"
				>
					<div className="shareModal__title">
						<h3>Deel dit gesprek met vrienden</h3>
					</div>

					<div className="shareModal__description">
						<p>Alles is leuker samen met je vrienden, deel daarom deze chat met al je vrienden zodat je samen kan supporteren voor jouw favoriete club!</p>
					</div>

					<CopyToClipboard text={url} onCopy={onCopyClick}>
						<div className="shareModal__link">
							<div className="shareModal__input">{url}</div>
							<div className="shareModal__copy">Kopieer naar klembord</div>						
						</div>
					</CopyToClipboard>
				</ReactModal>
			);
		}
	}
}
const mapStateToProps = (state) => {
	return {
		visibility: selectors.ui.shareModalSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onCopyClick: () => {
			dispatch(actions.ui.uiActions.hideShareModal());
		},
	};
}
const ShareModal = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareModalPresentational);

export default ShareModal;
