import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import isEqual from 'lodash/isEqual';

// eslint-disable-next-line
import * as Player from "./../../lib/jwplayer.js"; // Also disabled linting in file
import * as selectors from './../../selectors';

class MediaPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = { new_video: props.media.type === 'VIDEO' };
		this.jwplayer = window.jwplayer;
		this.jwplayer.key = 'I/LLFEHLJY4pWk18aHA4OIcLdB3UEVilDB2O8g==';

		this.videoIsPlaying = this.videoIsPlaying.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(!isEqual(this.props.media, nextProps.media)) {
			// Clean current video up for new video
			if(this.videoIsPlaying()) {
				const video_div = $('#jw_video');
				this.jwplayer(video_div[0]).remove();
			}

			// Prepare component for new media
			this.setState({ new_video: nextProps.media.type === 'VIDEO' });
		}
	}

	videoIsPlaying() {
		const { media } = this.props;
		const video_div = $('#jw_video');
		return (media.type === 'VIDEO' && video_div.is('div'));
	}

	componentDidUpdate() {	
		// If current media is video, start autoplaying video
		if(this.state.new_video) {
			const { media } = this.props;
			const video_div = $('#jw_video');
			this.jwplayer(video_div[0]).setup({
				file: media.url,
				mute: false, 
				controls: false,
				autostart: true,
				repeat: true,
				stretching: "uniform",
				width: "100%",
				height: "100%"
			});
			this.setState({ new_video: false });
		}
	}

	getMediaElement() {
		const { media } = this.props;
		switch(media.type) {
			case 'IMAGE':
				return (
					<img src={media.url} alt="media" />				
				);
			case 'VIDEO':
				return (
					<div id="jw_video" className="jw_video">
						<p>Loading player...</p>
					</div>
				);
			default: 
				return (
					<p>Looking for media...</p>
				);
		}
	}

	render() {
		return (
			<div className="media">
				{ this.getMediaElement() }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { 
		media: selectors.zender.mediaSelector(state),
	};
}
const Media = connect(
	mapStateToProps,
	null,
)(MediaPresentational);

export default Media;