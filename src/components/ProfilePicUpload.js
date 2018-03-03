import React from 'react';
import axios from 'axios';
import { ProfilePic } from './ProfilePic';

export class ProfilePicUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.chooseFile = this.chooseFile.bind(this);
		this.uploadPic = this.uploadPic.bind(this);
		
	}
	chooseFile(e) {
		this.file = e.target.files[0];
	}

	uploadPic() {
		const formData = new FormData() //upload image via ajax due to the FormData API, create a FormData instance and append the file to it 
		formData.append('file', this.file);
		axios.post('/upload', formData)
		.then((result) => {
			if (result.data.success) {	
				this.props.setPic(result.data.filename)	
			} else {
				this.setState({
					error: true
				})
			}
		})
		.catch((err) => {
        	console.log("post formData", err.stack);
		})	
	}
	render() {
		return (
			<div className="upload-container">
				<h1>Change your image</h1>
				<input type="file" name="file" onChange={(e) => this.chooseFile(e)} />
				<button onClick={() => this.uploadPic()}>UPLOAD</button> 
			</div>
		)
	}
}

