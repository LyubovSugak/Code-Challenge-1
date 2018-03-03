import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Registration from './Registration';
import Login from './Login';

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div id="welcome">
            <div className="top-container">
                <h1>Smoking-Room</h1>
                <Link to="/login"><p>Login</p></Link>
            </div>
            <div className="bottom-container">
                <div>
                    <h3>Let's talk about modern European art, post unique art-pieces, tell interesting stories about masters</h3>
                    <img src="./welcome-image.jpg" />    
                </div>
                <div className="reg-form">
                    <h2>Join us to smoke and to talk</h2>
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>    
        )
    }    
}

