import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/Routes';
import store from './store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './history';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app')
);
