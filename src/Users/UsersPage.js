import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Alert, UncontrolledAlert } from 'reactstrap'
import { Router, Route } from 'react-router-dom'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { userActions as actions, alertActions } from '../_actions'
import { UserDetailsPage as detailsPage } from './UserDetailsPage'

let url = '/users'

class UsersPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(actions.getAll())
  }
  handleDeleteUser(id) {
    return (e) => this.props.dispatch(actions.delete(id))
  }
  showList(models){
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
        {models.items.map((model, index) =>
          <tr key={model.id}>
            <th scope="row">{index+1}</th>
            <td>{model.name}</td>
            <td>{model.first_name}</td>
            <td>{model.email}</td>
            <td><Link to={`${url}/${model.id}`}>View/Edit</Link></td>
          </tr>)}
      </tbody>
    </Table>
  }

  render() {
    const { user, users, alert } = this.props
    let models = users
    return (
      <div>
        <h3>Users List</h3>
        {alert.message && <FlashMessage text={alert.message} delay={5000}/>}
        {models.loading && <em>Loading models...}</em>}
        {models.error && <span className="text-danger">ERROR: {models.error}</span>}
        {models.items && this.showList(models) }
        <Router history={history}>
          <div>
            <PrivateRoute path={`${url}/:id`} component={detailsPage} />
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