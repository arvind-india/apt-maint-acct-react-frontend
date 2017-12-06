import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { userActions } from '../_actions'


class HomePage extends React.Component {
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
        <h1>{user && <div>Logged In</div>}</h1>
        <p>Welcome to Apartment Maintenance Tracking site</p>
        <p>
          <Link to="/login">Logout</Link>
        </p>
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

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }
