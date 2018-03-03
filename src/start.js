import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Route, IndexRoute  } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { reducer } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import getSocket from './sockets';
import { Welcome } from './components/auth/Welcome';
import { App } from './components/App';

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));
getSocket();

let guestRouter = (
	<HashRouter>
		<Welcome />
	</HashRouter>
)

let userRouter = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
)

let router = location.pathname === '/welcome' ? guestRouter : userRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);


// <--w W-->
