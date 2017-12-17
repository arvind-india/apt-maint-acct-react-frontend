import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { UsersPage, UserDetailsPage } from './UsersPage'
import { AppNavbar } from './AppNavbar'

import { AuthenticatedRoute } from './AuthenticatedRoute'
import { UnauthenticatedLayout, PrimaryLayout } from './_layouts'

class App extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = this.props
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear())
    })
  }

/*  render() {
    return (
      <div>
        <AppNavbar/>
        <Router history={history}>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Switch>
              <PrivateRoute path="/users/:id" component={UserDetailsPage} />
              <PrivateRoute path="/users" component={UsersPage} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }  */

  render() {
    return (
      <div>
        <AppNavbar />
        <Router history={history}>
          <Switch>
            <Route path="/login" component={UnauthenticatedLayout} />
            <AuthenticatedRoute path="/app" component={PrimaryLayout} />
            <Redirect to="/login" />
          </Switch>
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state
  return {
    alert
  }
}
const connectedApp = connect(mapStateToProps)(App)
export { connectedApp as App}
