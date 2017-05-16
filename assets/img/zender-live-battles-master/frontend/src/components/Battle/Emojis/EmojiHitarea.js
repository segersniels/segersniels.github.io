import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as zenderActions, selectors as zenderSelectors } from 'zender-api-client';
import forEach from 'lodash/forEach';

import EmojiCanvas from './utils/EmojiCanvas';
import { calculateDiffCounters } from './utils/DiffCounter';
import * as selectors from './../../../selectors';

class EmojiHitareaPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = { counters: {}, total: 0 };
		this.onAreaClick = this.onAreaClick.bind(this);
	}

	componentDidMount() {
		const canvas = this.refs['canvas'];
		this.emojiCanvas = new EmojiCanvas(canvas);
		this.emojiCanvas.startRenderLoop();
	}

	componentWillUnmount() {
		this.emojiCanvas.stopRenderLoop();
	}

	componentWillReceiveProps(nextProps) {		
		const old_counters = this.state.counters;
		const new_counters = nextProps.counters;

		if(nextProps.total > this.state.total) {
			this.setState({ total: nextProps.total });

			// Get difference between counters
			const diff = calculateDiffCounters(old_counters, new_counters);

			// Add all emojis of diff to list
			const emojis = [];
			forEach(diff, (amount, url) => {
				url = this.props.cdn + url;
				const set = this.props.emojiSet;
				const isFromChoiceSet = set.filter((emoji) => emoji.url === url).length > 0;
				const emoji = { url, isFromChoiceSet };

				emojis.push({ emoji, amount });
			});

			this.emojiCanvas.addEmojis(emojis);
		}
		this.setState({ counters: new_counters });
	}

	getRandomHeight() {
		const percent = window.innerHeight * 0.3;
		return (Math.floor(Math.random() * (window.innerHeight - (percent*2))) + percent);
	}

	onAreaClick(event) {
		// Get click coordinates
		const { clientX, clientY } = event;

		// Increment total and update UI
		this.setState({ total: this.state.total + 1 }, () => {
		
			// Get current emoji
			const emoji = this.props.currentEmoji;
			emoji.isFromChoiceSet = true;
			emoji.coordinates = { x: clientX, y: clientY };
			
			// Add emoji to canvas + push to zender
			this.emojiCanvas.addEmoji(emoji);
			this.props.onHitAreaClick(emoji);
		});
	}

	render() {
		const { enabled } = this.props;
		const clickHandler = enabled ? this.onAreaClick : null;
		return (
			<div className="emojiHitArea" id="EmojiHitArea">
				<canvas ref="canvas" onClick={clickHandler} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { 
		currentEmoji: selectors.ui.currentEmojiSelector(state),
		emojiSet: selectors.ui.emojiSetSelector(state),
		counters: selectors.zender.emojisCountersSelector(state),
		enabled: zenderSelectors.emojis.enabledSelector(state),
		total: zenderSelectors.emojis.emojisTotalSelector(state),
		cdn: zenderSelectors.emojis.cdnHostSelector(state),
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
		onHitAreaClick: (emoji) => {
			dispatch(zenderActions.emojis.uiActions.triggerEmoji(emoji));
		}
	};
}
const EmojiHitarea = connect(
	mapStateToProps,
	mapDispatchToProps,
)(EmojiHitareaPresentational);

export default EmojiHitarea;