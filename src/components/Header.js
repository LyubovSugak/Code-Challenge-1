import React from 'react';
import { Link } from 'react-router-dom';
import { ProfilePic } from './ProfilePic';

export function Header() {
	return ( 
		<div id="header"> 
			<h1 className="logo">Smoking-Room</h1>
			<Link to="/"><p>Profile</p></Link>
			<Link to="/online-users"><p>On-Line</p></Link>
			<Link to="/friends"><p>Friends</p></Link>
			<Link to="/chat"><p>Chat</p></Link>
			<div className="pic-logout-container">
				<ProfilePic /> 
				<a href={"/logout"}>Log Out</a>
			</div>
		</div>
	)
}