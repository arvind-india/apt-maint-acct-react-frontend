import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from './_helpers'
import { alertActions } from './_actions'
import { PrivateRoute } from './_components'
import { HomePage } from './Home'
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from './Login'
import { RegisterPage, RegistrationConfirmPage } from './Register'
import {
  AccountsPage,
  AccountDetailsPage,
  SummaryPage,
  MonthlyAccountsPage,
  MyAccountsPage
} from './Accounts'
import { ResidentsPage, ResidentDetailsPage } from './Residents'
import { FlatsPage, FlatDetailsPage } from './Flats'
import { FlatsToResidentsLinkPage } from './Links'
import { RolesPage, RoleDetailsPage } from './Roles'
import { PermissionsPage, PermissionDetailsPage } from './Permissions'
import { RolesToPermissionsLinkPage } from './Links'
import { UsersToRolesLinkPage } from './Links'
import { UsersPage, UserDetailsPage, UserProfilePage } from './Users'
import { AppNavbar } from './AppNavbar'
import { DurationsPage, DurationDetailsPage } from './Durations'

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
          <div className="site">
            <header><AppNavbar/></header>
            <div className="site-content">
              <Route exact path="/" component={HomePage} />
              <Route path="/home" component={HomePage} />
              <Switch>
                <Route path="/login/reset/:token" component={ResetPasswordPage} />
                <Route path="/login/forgot-password" component={ForgotPasswordPage} />
                <Route path="/login" component={LoginPage} />
              </Switch>
              <Route path="/register" component={RegisterPage} />
              <Route path="/registration-confirm/:code" component={RegistrationConfirmPage} />
              <PrivateRoute path="/accounts-summary" component={SummaryPage} />
              <Switch>
                <PrivateRoute path="/accounts/:id" component={AccountDetailsPage} />
                <PrivateRoute path="/accounts" component={AccountsPage} />
              </Switch>
                <PrivateRoute path="/monthly-accounts" component={MonthlyAccountsPage}/>
                <PrivateRoute path="/my-accounts" component={MyAccountsPage} />
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
              <Switch>
                <PrivateRoute path="/durations/:id" component={DurationDetailsPage} />
                <PrivateRoute path="/durations" component={DurationsPage} />
              </Switch>
            </div>
            <footer className="footer">
              <span className="copyright">&copy;{new Date().getFullYear()}</span>
              <span className="weblink"><a href="https://eastgate.in">eastgate.in</a></span>
            </footer>
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
