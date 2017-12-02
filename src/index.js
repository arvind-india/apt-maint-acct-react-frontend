import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import { App } from './App';
//import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css'
import { store } from './_helpers'

// setup fake backend
//import { configureFakeBackend } from './_helpers'
//configureFakeBackend()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
//registerServiceWorker();
