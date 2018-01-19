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
import { permissionActions as actions, alertActions } from '../_actions'
import { PermissionDetailsPage as detailsPage } from './PermissionDetailsPage'

let url = '/permissions'

class PermissionsPage extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(actions.getAll())
  }
  handleDeleteModel(id) {
    console.log('Deleting Permission with id: ', id)
    //return (e) => this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  }
  showList(models){
    let newModel = {
      model: {
        id: 0,
        condition:'',
        description: ''
      }
    }
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Operations</th>
          <th>Resource</th>
          <th>Conditions</th>
          <th>Description</th>
          <th>Actions <Link
                        to={{ pathname: `${url}/0`, state: newModel }}
                        title="Add"
                        ><MdAdd/></Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {models.items.map((model, index) =>
          <tr key={model.id}>
            <th scope="row">{index+1}</th>
            <td>{model.operations}</td>
            <td>{model.resource}</td>
            <td>{model.condition}</td>
            <td>{model.description}</td>
            <td>
              <Link
                to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
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
    console.log('Props in PermissionsPage: ', this.props)
    const { user, permissions, alert } = this.props
    let models = permissions
    return (
      <div>
        <h3>Permissions List</h3>
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
  const { permissions, authentication, alert } = state
  const { user } = authentication
  return {
    user,
    permissions,
    alert
  }
}

const connectedPermissionsPage = connect(mapStateToProps)(PermissionsPage)
export { connectedPermissionsPage as PermissionsPage }
