import React from 'react'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configure-store'
import Routes from './ui/router/index';

const store = configureStore()

export default () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={Routes} />
      </Switch>
    </Router>
  </Provider>
)
