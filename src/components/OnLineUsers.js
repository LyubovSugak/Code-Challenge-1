import React from 'react';
import { connect } from 'react-redux';

export class OnLineUsers extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {};  
        this.renderOnlineUsers = this.renderOnlineUsers.bind(this); 
    }

    renderOnlineUsers() {
    	if (!this.props.online) {
    		return (
    			<p>Uuu... everybody are smoking outside</p>
    		)
    	}
    	return (
    		this.props.online.map(elem => {
    			var image = elem.pic ? elem.pic : "/static/default.jpeg";
    			return (
    				<div className="online-user" key={elem.id}>
    					<img src={image} />
    					<div>{elem.first} {elem.last}</div>
    				</div>
    			)
    		})
    	)	
    }

    render() {
    	return (
    		<div className="online-users-container">
    			<h2>On-Line Smokers</h2>
    			{this.renderOnlineUsers()}
    		</div>
    	)
    }
}

function mapStateToProp(state) {
	return ({
		online: state.usersData,
	})
}

export default connect(mapStateToProp)(OnLineUsers);

