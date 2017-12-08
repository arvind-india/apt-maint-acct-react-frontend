import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { userActions } from '../_actions'

class UsersPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(userActions.getAll())
  }
  handleDeleteUser(id) {
    return (e) => this.props.dispatch(userActions.delete(id))
  }
  render() {
    const { user, users } = this.props
    return (
      <div>
        <h1>Hi {user.firstName}!</h1>
        <p>You're logged in with React!!</p>
        <h3>All registered users:</h3>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state
  const { user } = authentication
  return {
    user,
    users
  }
}

const connectedUsersPage = connect(mapStateToProps)(UsersPage)
export { connectedUsersPage as UsersPage }
