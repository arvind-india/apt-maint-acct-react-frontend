import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Alert, UncontrolledAlert } from 'reactstrap'
import { Router, Route } from 'react-router-dom'

import {
  MdAdd,
  MdVisibility,
  MdDelete
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { roleActions as actions, alertActions } from '../_actions'
import { RoleDetailsPage as detailsPage } from './RoleDetailsPage'

let url = '/roles'

class RolesPage extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(actions.getAll())
  }
  handleDeleteModel(id) {
    console.log('Deleting Role with id: ', id)
    //return (e) => this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  }
  showList(models){
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Role Name</th>
          <th>Description</th>
          <th>Inherits</th>
          <th>Actions <Link to={`${url}/0`} title="Add"><MdAdd/></Link></th>
        </tr>
      </thead>
      <tbody>
        {models.items.map((model, index) =>
          <tr key={model.id}>
            <th scope="row">{index+1}</th>
            <td>{model.name}</td>
            <td>{model.description}</td>
            <td>{model.inherits}</td>
            <td>
              <Link
                to={`${url}/${model.id}`}
                title="View or Edit"
              ><MdVisibility/></Link>
              <Button
                color="link"
                title="Delete"
                onClick={() => this.handleDeleteModel(model.id)}
              ><MdDelete color="red"/></Button>
            </td>
          </tr>)}
      </tbody>
    </Table>
  }

  render() {
    console.log('Props in RolesPage: ', this.props)
    const { user, roles, alert } = this.props
    let models = roles
    return (
      <div>
        <h3>Roles List</h3>
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
  const { roles, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    roles,
    alert
  }
}

const connectedRolesPage = connect(mapStateToProps)(RolesPage)
export { connectedRolesPage as RolesPage }
