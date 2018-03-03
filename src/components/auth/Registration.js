import React from 'react';
import { wrappedAuth } from './Auth';

function RegistrationForm({ error, handleInput, handleSubmit }) {
    return (
        <div className="input-container">
            {error && <div>FAILURE</div>}
            <input name="first" placeholder="First Name" onChange={handleInput} />
            <input name="last" placeholder="Last Name" onChange={handleInput} />
            <input name="email" type="email" required placeholder="Email" onChange={handleInput} />
            <input name="pass" required placeholder="Password" onChange={handleInput} />
            <button onClick={handleSubmit}>SUBMIT</button>
        </div>
    )   
}

export default wrappedAuth(RegistrationForm, '/register');






// <--w W-->