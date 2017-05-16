import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import ColorPicker from './ColorPicker';

import * as actions from './../../../actions';

import './CreateBattleForm.css';

class CreateBattleFormPresentational extends Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
		this.validateForm = this.validateForm.bind(this);
	}

	getInitialState() {
		return {
			title: '',
			descr: '',
			choice_1_name: '',
			choice_1_avatar: '',
			choice_1_color: { r: 0, g: 69, b: 150 },
			choice_2_name: '',
			choice_2_avatar: '',
			choice_2_color: { r: 244, g: 67, b: 54 },
			streamId: '188c7c4b-b02d-4724-9f73-be8efea3a2d9',
		};
	}

	handleInputChange(event) {
		const target = event.target;
		const data = Object.assign(this.state, {[target.name]: target.value});
		this.setState(data);
	}

	handleColorPickerChange(name, color) {
		const data = Object.assign(this.state, {[name]: color});
		this.setState(data);
	}

	validateForm() {
		const data = values(this.state).filter((value) => value === '');
		return isEmpty(data);
	}

	render() {
		const { onFormSubmit } = this.props;

		return (
			<div className="CreateBattleForm">	
				<form>
					<fieldset>
						<legend>General</legend>
						<div className="row">
							<div className="six columns">
								<label htmlFor="title">Title:</label>
								<input type="text" className="u-full-width" placeholder="Title" name="title" value={this.state.title} onChange={this.handleInputChange} />
							</div>
							<div className="six columns">
								<label htmlFor="description">Description:</label>
								<input type="text" className="u-full-width" placeholder="Description" name="descr" value={this.state.descr} onChange={this.handleInputChange} />
							</div>
						</div>
					</fieldset>	

					<fieldset>
						<legend>Choice 1</legend>
						<div className="row">
							<div className="four columns">
								<label htmlFor="choice_1_name">Name:</label>
								<input type="text" className="u-full-width" placeholder="Name" name="choice_1_name" value={this.state.choice_1_name} onChange={this.handleInputChange} />
							</div>
							<div className="four columns">
								<label htmlFor="choice_1_avatar">Avatar:</label>
								<input type="text" className="u-full-width" placeholder="Avatar-url" name="choice_1_avatar" value={this.state.choice_1_avatar} onChange={this.handleInputChange} />					
							</div>
							<div className="four columns">
								<label htmlFor="choice_1_color">Team color:</label>
								<ColorPicker 
									name="choice_1_color"
									color={ this.state.choice_1_color }
									onChange={this.handleColorPickerChange} />
							</div>
						</div>
					</fieldset>	

					<fieldset>
						<legend>Choice 2</legend>
						<div className="row">
							<div className="four columns">
								<label htmlFor="choice_2_name">Name:</label>
								<input type="text" className="u-full-width" placeholder="Name" name="choice_2_name" value={this.state.choice_2_name} onChange={this.handleInputChange} />
							</div>
							<div className="four columns">
								<label htmlFor="choice_2_avatar">Avatar:</label>
								<input type="text" className="u-full-width" placeholder="Avatar-url" name="choice_2_avatar" value={this.state.choice_2_avatar} onChange={this.handleInputChange} />					
							</div>
							<div className="four columns">
								<label htmlFor="choice_2_color">Team color:</label>
								<ColorPicker
									name="choice_2_color"
									color={this.state.choice_2_color}
									onChange={this.handleColorPickerChange} />
							</div>
						</div>
					</fieldset>	

					<fieldset>
						<legend>Zender</legend>
						<div className="row">
							<label htmlFor="choice_2_avatar">Stream id:</label>
							<input type="text" className="u-full-width" placeholder="Stream-id" name="streamId" value={this.state.streamId} onChange={this.handleInputChange} />								
						</div>
					</fieldset>	
					
					<input 
						type="button" 
						value="Create battle" 
						className="u-full-width button-primary" 
						disabled={!this.validateForm()} 
						onClick={() => {
							onFormSubmit(this.state);
						}} 
					/>
				</form>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onFormSubmit: (battle) => {
			dispatch(actions.battle.uiActions.addBattle(battle));
		},
	}
}
const CreateBattleForm = connect(
	null, 
	mapDispatchToProps
)(CreateBattleFormPresentational);

export default CreateBattleForm;
