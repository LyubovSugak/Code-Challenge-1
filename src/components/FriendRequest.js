import React from 'react';
import axios from 'axios';

export class FriendRequest extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {};
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
    }
	componentDidMount() {
		axios.get('/check-friend-status/' + this.props.friendId)
		.then(({data}) => {
			this.setState({
				message: data.message
			})
		})
	}
	sendFriendRequest() {
		axios.post('/friend_request', {
			recipient: this.props.friendId,
			message: this.state.message
		})
		.then(({data}) => {
			this.setState({
				message: data.message
			})
		})
	}

	render() {
		var addMessage = this.state.message ? this.state.message : 'Add Friend';
		return (
			<div>
				{!this.state.message && <div onClick={this.sendFriendRequest}><p>{addMessage}</p></div>}
				<div onClick={this.sendFriendRequest}><p>{addMessage}</p></div>	
			</div>
		)
	}
}
// 