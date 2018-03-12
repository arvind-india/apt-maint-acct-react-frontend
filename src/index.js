import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-select/dist/react-select.css'

import './gridforms.css'
import './index.css';  // moved to index.html to enable fast loading of first page

import { App } from './App';
import { store } from './_helpers'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
