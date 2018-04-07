import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';

import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './Home'
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from './Login'
//import LoginPage, { ForgotPasswordPage, ResetPasswordPage } from './Login'
import { RegisterPage } from './Register'
import { AccountsPage, AccountDetailsPage, SummaryPage } from './Accounts'
import { ResidentsPage, ResidentDetailsPage } from './Residents'
import { FlatsPage, FlatDetailsPage } from './Flats'
import { FlatsToResidentsLinkPage } from './Links'
import { RolesPage, RoleDetailsPage } from './Roles'
import { PermissionsPage, PermissionDetailsPage } from './Permissions'
import { RolesToPermissionsLinkPage } from './Links'
import { UsersToRolesLinkPage } from './Links'
import { UsersPage, UserDetailsPage, UserProfilePage } from './Users'
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
    return (
        <Router history={history}>
          <div>
            <AppNavbar/>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Switch>
              <Route path="/login/reset/:token" component={ResetPasswordPage} />
              <Route path="/login/forgot-password" component={ForgotPasswordPage} />
              <Route path="/login" component={LoginPage} />
            </Switch>
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/accounts-summary" component={SummaryPage} />
            <Switch>
              <PrivateRoute path="/accounts/:id" component={AccountDetailsPage} />
              <PrivateRoute path="/accounts" component={AccountsPage} />
            </Switch>
            <Switch>
              <PrivateRoute path="/residents/:id" component={ResidentDetailsPage} />
              <PrivateRoute path="/residents" component={ResidentsPage} />
            </Switch>
            <Switch>
              <PrivateRoute path="/flats/:id" component={FlatDetailsPage} />
              <PrivateRoute path="/flats" component={FlatsPage} />
            </Switch>
            <PrivateRoute path="/flatstoresidents" component={FlatsToResidentsLinkPage} />
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
            <PrivateRoute path="/usersToRoles" component={UsersToRolesLinkPage} />
            <PrivateRoute path="/userprofile" component={UserProfilePage} />
          </div>
        </Router>
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
