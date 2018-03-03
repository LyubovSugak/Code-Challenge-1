import React from 'react';
import { store } from '../start'
import { connect } from 'react-redux';
import { Header } from './Header';
import { Body } from './Body';
import { getUserProfile } from '../actions-user';

export class App extends React.Component {
	constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
		store.dispatch(getUserProfile());
	}
	
    render() {
		return (
			<div> 
				<Header />
				<Body />
			</div>
		)
    }		
}

export default connect({})(App);



{/* w W */}
