import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { UsersPage } from './UsersPage'
import { AppNavbar } from './AppNavbar'

class App extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = this.props
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear())
    })
  }
  render() {
    const { alert, user } = this.props
    return (
      <div>
        <AppNavbar/>
        {alert.message &&
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        }
        User has {user && <i>LoggedIn</i>}
        <Router history={history}>
          <div>
            <Route exact path="/" component={HomePage} />
            <PrivateRoute path="/users" component={UsersPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { alert, authentication } = state
  const { user } = authentication
  return {
    alert,
    user
  }
}
const connectedApp = connect(mapStateToProps)(App)
export { connectedApp as App}
