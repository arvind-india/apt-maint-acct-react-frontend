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
import { RolesPage, RoleDetailsPage } from './Roles'
import { UsersPage, UserDetailsPage } from './UsersPage'
import { AppNavbar } from './AppNavbar'

class App extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = this.props
    history.listen((location, action) => {
      // clear alert on location change
      // dispatch(alertActions.clear())
    })
  }

  render() {
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
              <PrivateRoute path="/roles/:id" component={RoleDetailsPage} />
              <PrivateRoute path="/roles" component={RolesPage} />
            </Switch>
            <Switch>
              <PrivateRoute path="/users/:id" component={UserDetailsPage} />
              <PrivateRoute path="/users" component={UsersPage} />
            </Switch>
          </div>
        </Router>
      </div>
    );
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
