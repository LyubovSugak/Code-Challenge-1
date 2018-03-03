import React from 'react';
import axios from 'axios';

export function wrappedAuth(Component, url) {   //wrap function
    return class Auth extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.handleInput = this.handleInput.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        handleInput(e) {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
        handleSubmit(e) {
            console.log(url, this.state)
            e.preventDefault();
            axios.post(url, this.state)
            .then((res) => {
                if (res.data.success) {
                    location.replace('/')
                } else {
                    this.setState({ //setState the only one posibility to tell React to show new page
                        error: true
                    });
                }
            })
        }
        render() {
            return <Component
                error={this.state.error}
                handleInput={(e) => this.handleInput(e)}
                handleSubmit={(e) => this.handleSubmit(e)}
            /> 
        }
    }
}