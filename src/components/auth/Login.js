import React from 'react';
import { wrappedAuth } from './Auth';

function LoginForm({error, handleInput, handleSubmit}) {
	return (
		<div className="input-container"> 
            {error && <div>FAILURE</div>}
			<input name="email" type="email" required placeholder="Email" onChange={handleInput} />
            <input name="pass" required placeholder="Password" onChange={handleInput} />
            <button onClick={handleSubmit}>LOGIN</button>
		</div>
	)	
}

export default wrappedAuth(LoginForm, '/login');