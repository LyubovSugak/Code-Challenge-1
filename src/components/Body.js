import React from 'react';
import { Route } from 'react-router-dom';
import { App } from './App';
import Profile from './Profile';
import { OtherUser } from './OtherUser';
import Friends from './Friends';
import OnLineUsers from './OnLineUsers';
import Chat from './Chat';

export function Body(props) {
	return (
		<div>
			<Route exact path="/" component={Profile} />
			<Route path="/user/:id" component={OtherUser} />
			<Route path="/friends" component={Friends} />
			<Route path="/online-users" component={OnLineUsers} />
			<Route path="/chat" component={Chat} />
		</div>
	)
}
// 
//

