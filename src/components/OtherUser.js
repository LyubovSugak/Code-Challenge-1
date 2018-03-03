import React from 'react';
import axios from 'axios';
import { FriendRequest } from './FriendRequest';


export class OtherUser extends React.Component {
	constructor(props) {
        super(props);
        this.state = {};
    }
    // componentWillReceiveProps (nextProps) {

    // }
    componentDidMount() {
        axios.get('/user/' + this.props.match.params.id + '/other')
        .then(({data}) => {
            if (data.ownProfile) {
                this.props.history.push('/')
            } else {
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    pic: data.pic,
                    bio: data.bio
                })
            }   
        })   
    }
    
    render() {
        var image = this.state.pic ? this.state.pic : "/static/default.jpeg";
    	return (
    		<div className="other-user-profile">
                <h1>{this.state.first} {this.state.last}</h1>
                <img src={image} />
                <p id="bio-text-user">{this.state.bio}</p>
                <FriendRequest friendId={this.props.match.params.id} />
            </div>
    	)
    }
}