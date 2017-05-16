import React, { Component } from 'react'
import { TwitterPicker } from 'react-color'

import './ColorPicker.css';

// BASED ON: https://casesandberg.github.io/react-color/#create
class ColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			displayColorPicker: false, 
			color: props.color ,
		};
		this.handleToggle = this.handleToggle.bind(this);
		this.handleColorPick = this.handleColorPick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleToggle() {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	}

	handleColorPick(color) {
		const { name, onChange } = this.props;
		this.setState({ color: color.rgb }, () => {
			onChange(name, color.rgb);
		});
	}

	handleClose() {
		this.setState({ displayColorPicker: false })
	}

	render() {
		const { color } = this.state;
		return (
			<div className="ColorPicker">
				<button 
					type="button" 
					onClick={ this.handleToggle }
					style={{ background: `rgb(${color.r}, ${color.g}, ${color.b})` }}>Pick Color</button>
				
				{ 
					this.state.displayColorPicker ? 
						<div className="popover">
							<div className="cover" onClick={ this.handleClose }></div>
							<TwitterPicker 
								color={color}
								onChange={this.handleColorPick} />
						</div>
						: null
				}
			</div>
		);
	}
}

export default ColorPicker;