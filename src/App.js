import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
//import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './Home'
import { LoginPage } from './Login'
import { RegisterPage } from './Register'
import { RolesPage, RoleDetailsPage } from './Roles'
import { PermissionsPage, PermissionDetailsPage } from './Permissions'
import { RolesToPermissionsLinkPage } from './Links'
import { UsersPage, UserDetailsPage } from './Users'
import { AppNavbar } from './AppNavbar'

class App extends Component {
  constructor(props) {
    super(props)
//    const { dispatch } = this.props
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
              <PrivateRoute path="/permissions/:id" component={PermissionDetailsPage} />
              <PrivateRoute path="/permissions" component={PermissionsPage} />
            </Switch>
            <PrivateRoute path="/rolestopermissions" component={RolesToPermissionsLinkPage} />
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
