import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { Router, Route } from 'react-router-dom'
import AlertContainer from 'react-alert'

import { history } from '../_helpers'
import { PrivateRoute } from '../_components'
import { userActions, alertActions } from '../_actions'
import { UserDetailsPage } from './UserDetailsPage'

class UsersPage extends React.Component {

  alertOptions = {
    offset: 14,
    position: 'top left',
    theme: 'dark',
    time: 2000,
    transition: 'scale'
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll())
  }
  handleDeleteUser(id) {
    return (e) => this.props.dispatch(userActions.delete(id))
  }
  show(message) {
    this.msg.show(message, {time: 5000})
  }
  render() {
    const { user, users } = this.props
    return (
      <div>
        <h3>Users List</h3>
        {users.items && alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
        {alert.message ? this.show(alert.message) : null}
        {users.loading && <em>Loading users...}</em>}
        {users.error && <span className="text-danger">ERROR: {users.error}</span>}
        {users.items &&
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.items.map((user, index) =>
                <tr key={user.id}>
                  <th scope="row">{index+1}</th>
                  <td>{user.name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.email}</td>
                  <td><Link to={`/users/${user.id}`}>View/Edit</Link></td>
                </tr>)}
            </tbody>
          </Table>
        }
        <Router history={history}>
          <div>
            <PrivateRoute path="/users/:id" component={UserDetailsPage} />
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { users, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    users,
    alert
  }
}

const connectedUsersPage = connect(mapStateToProps)(UsersPage)
export { connectedUsersPage as UsersPage }
