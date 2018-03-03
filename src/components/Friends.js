import React from 'react';
import { connect } from 'react-redux';
import { receiveFriends } from '../actions-friends';
import { FriendRequest } from './FriendRequest'

class Friends extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pending: [],
			friends: []
		}
		this.renderPending = this.renderPending.bind(this);
		this.renderFriends = this.renderFriends.bind(this);
	}
	componentDidMount() {
		this.props.dispatch(receiveFriends())
	}
	renderPending() {
		if (!this.props.pending) {
			return (
				<p>LOADING...</p>
			)
		}
		return this.props.pending.map((elem) => {
			var image = elem.pic ? elem.pic : "/static/default.jpeg";
			return (
				<div className="pending-friends" key={elem.id}>
					<img src={image} />
					<div>{elem.first} {elem.last}</div>
					<FriendRequest friendId={elem.id} />
				</div>
			)
		})
	}
	renderFriends() {

		if (!this.props.friends) {
			return (
				<p>LOADING...</p>
			)
		}
		return this.props.friends.map((elem) => {
			var image = elem.pic ? elem.pic : "/static/default.jpeg";
			return (
				<div className="current-friends" key={elem.id}>
					<img src={image} />
					<div>{elem.first} {elem.last}</div>
					<FriendRequest friendId={elem.id} />
				</div>
			)
		})
	}
	render() {
		return (
			<div className="friend-list-container">
				<h2>Pending Friends</h2>
				<div className="pending-friends-container">
					{this.renderPending()}
				</div>
				<h2>Current Friends</h2>
				<div className="current-friends-container">
					{this.renderFriends()}
				</div>
			</div>

		)
	}
}

function mapStateToProp(state) {
	return ({
		pending: state.listOfFriends && state.listOfFriends.filter((elem) => elem.status == 1),
		friends: state.listOfFriends && state.listOfFriends.filter((elem) => elem.status == 2)
	})
}
export default connect(mapStateToProp)(Friends);

