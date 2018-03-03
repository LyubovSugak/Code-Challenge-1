import React from 'react';
import axios from 'axios';
import { ProfilePicUpload } from './ProfilePicUpload';

export class ProfilePic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.showUploader = this.showUploader.bind(this);
		this.setPic = this.setPic.bind(this);
	}
	componentDidMount() {
		axios.get('/user')
		.then(({data}) => this.setState({
			pic: data.userProfile.pic
		})) 
	}
	showUploader() {
		var switcher = this.state.isUploaderVisible ? false : true;
		// if(this.state.isUploaderVisible) {
		// 	switcher = false;
		// } else {
		// 	switcher = true;
		// }
		this.setState({
			isUploaderVisible: switcher
		})	
	}
	// picUrl - возвращается из компонента ProfilePicUpload - props.setPic(result.data.filename)
	setPic(picUrl) {
		this.setState({
			pic: picUrl
		})
	}

	render() {
		var image = this.state.pic ? this.state.pic : "/static/default.jpeg";
		return (
			<div>
				<img className="profile-pic" onClick={this.showUploader} src={image} /> 
				{this.state.isUploaderVisible && <ProfilePicUpload setPic={(picUrl) => this.setPic(picUrl)} />}
			</div>
		)
	}
}