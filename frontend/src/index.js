import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import { Provider } from 'react-redux';
import {configureStore, applyMiddleware} from "@reduxjs/toolkit";
import thunk from 'redux-thunk'
import rootReducer from './reducers'

//dev tools
import {composeWithDevTools} from '@redux-devtools/extension'
import logger from 'redux-logger'


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore(
  {reducer : rootReducer},
  composeWithDevTools(applyMiddleware(thunk, logger))
)


root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
