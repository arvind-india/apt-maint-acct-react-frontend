import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'

import { userActions } from '../_actions'

class UserDetailsPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(userActions.getById(this.props.match.params.id))
  }
  render() {
    const { userDetails, user, match } = this.props
    return (
      <div>
        <h3>User Details of {match.params.id}</h3>
        {userDetails.loading && <em>Loading user details...}</em>}
        {userDetails.error && <span className="text-danger">ERROR: {userDetails.error}</span>}
        {userDetails.data &&
          <p>User email: {userDetails.data.email}</p>
        }
      </div>
    )
  }
}

/*

return (
  <div>
    <h3>Users List</h3>
    {users.loading && <em>Loading users...}</em>}
    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
    {users.items &&
      <Table>


*/


function mapStateToProps(state) {
  const { userDetails, authentication } = state
  const { user } = authentication
  return {
    user,
    userDetails
  }
}

const connectedDetailsPage = connect(mapStateToProps)(UserDetailsPage)
export { connectedDetailsPage as UserDetailsPage }
