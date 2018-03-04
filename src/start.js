import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Route, IndexRoute  } from 'react-router-dom';
import { App } from './components/App';

let userRouter = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
)


ReactDOM.render(
    userRouter,
    document.querySelector('main')
);


// <--w W-->
