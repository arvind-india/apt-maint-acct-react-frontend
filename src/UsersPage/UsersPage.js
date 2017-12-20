import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Alert, UncontrolledAlert } from 'reactstrap'
import { Router, Route } from 'react-router-dom'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { userActions, alertActions } from '../_actions'
import { UserDetailsPage } from './UserDetailsPage'


class UsersPage extends React.Component {
/*
  constructor(props) {
    super(props)

    this.state = {
      visible: true
    }

    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss() {
    this.setState({ visible: false })
    this.timer = null
  }
  setTimer() {
    // clear any existing timer
    this.timer != null ? clearTimeout(this.timer) : null

    // hide after 'delay' milliseconds
    this.timer = setTimeout(this.onDismiss, 5000)
  }
  */
  componentDidMount() {
    this.props.dispatch(userActions.getAll())
//    this.setTimer()
  }
/*  componentWillUnmount() {
    clearTimeout(this.timer)
  } */
  handleDeleteUser(id) {
    return (e) => this.props.dispatch(userActions.delete(id))
  }
  showList(users){
    return <Table>
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
//  {alert.message && <UncontrolledAlert color={alert.color}>{alert.message}</UncontrolledAlert>}
//  {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
/*
{alert.message
  && <Alert
        color={alert.color}
        isOpen={this.state.visible}
        toggle={this.onDismiss}
      >Controlled Alert Message: {alert.message}</Alert>}
*/
  render() {
    const { user, users, alert } = this.props
    return (
      <div>
        <h3>Users List</h3>
        {alert.message && <FlashMessage alert={alert} />}
        {users.loading && <em>Loading users...}</em>}
        {users.error && <span className="text-danger">ERROR: {users.error}</span>}
        {users.items && this.showList(users) }
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
