import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { sendBio, updateBio } from '../actions-user';

export class Bio extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.showBioInput = this.showBioInput.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.setState({
			bio: this.props.bio
		})
		console.log('PROPS', this.props)
	}

	showBioInput() {
		var switcher =  this.state.isInputVisible ? false : true;
		this.setState({
			isInputVisible: switcher
		})	
	}

	handleInput(e) {
		this.setState({
			bio: e.target.value
		})
		e.preventDefault();
	}

	handleSubmit(e) {
		axios.post('/bio', {
			bio: this.state.bio
		})
		.then((result) => {
			this.setState({
				isInputVisible: false
			})
		})	
	}

	render() {
		return (
			<div className="bio-container">
				{!this.state.isInputVisible && !this.state.bio && <p onClick={this.showBioInput}>Add your Bio</p>}
				{this.state.isInputVisible && 
					<div><input type="text" name="bio" value={this.state.bio} onChange={(e) => this.handleInput(e)} /> 
					<p onClick={() => this.handleSubmit()}>SAVE</p></div>}
				{!this.state.isInputVisible && this.state.bio && <div><p id="bio-text">{this.state.bio}</p><div onClick={this.showBioInput}><p>EDIT</p></div></div>}
			</div>
		)
	}
}

//  w W /