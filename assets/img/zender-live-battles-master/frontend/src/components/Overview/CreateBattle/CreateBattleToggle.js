import React, { Component } from 'react';

import CreateBattleForm from './CreateBattleForm';

import './CreateBattleToggle.css';

class CreateBattleToggle extends Component {
	constructor(props) {
		super(props);
		this.state = { formOpen: false };
		this.toggleForm = this.toggleForm.bind(this);
	}

	toggleForm() {
		this.setState({ formOpen: !this.state.formOpen });
	}

	render() {
		const { formOpen } = this.state;

		return (
			<div className="CreateBattleToggle">
				<div className="button_row">
					<button className="button-primary" onClick={this.toggleForm}>{formOpen ? "Cancel" : "Add battle"}</button>
				</div>

				<div className={formOpen  ? "form_row openForm" : "form_row closedForm"}>	
					<CreateBattleForm />
				</div>
			</div>
		);
	}
}

export default CreateBattleToggle;