import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Bio } from './Bio';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	render() {
		if (!this.props.userProfile) {
			return (
				<div>LOADING</div>
			)
		}
		var image = this.props.userProfile.pic ? this.props.userProfile.pic : "/static/default.jpeg";
		return (
			<div className="profile-container">
				<div className="pic-name-container">
					<img src={image} /> 
					<div><h3>{this.props.userProfile.first} {this.props.userProfile.last}</h3></div>
				</div>
				<div className="bio-container">
					<Bio bio={this.props.userProfile.bio} />
				</div>
			</div>
		)
	}
}

function mapStateToProp(state) {
	return ({
		userProfile: state.userProfile
	})
}
export default connect(mapStateToProp)(Profile);
// bio={this.props.bio} setBio={this.props.setBio}