import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { Router } from 'react-router-dom'

import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { permissionActions as actions } from '../_actions'
import { PermissionDetailsPage as detailsPage } from './PermissionDetailsPage'

let url = '/permissions'
let module = 'permissions'

class PermissionsPage extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(actions.getAll())
  }

  render() {
    console.log('Props in PermissionsPage: ', this.props)
    const { permissions, alert, authzn } = this.props
    let models = permissions
    return (
      <div>
        <h3>Permissions List</h3>
        {alert.message && <FlashMessage text={alert.message} delay={5000}/>}
        {models.loading && <em>Loading models...}</em>}
        {models.error && <span className="text-danger">ERROR: {models.error}</span>}
        {models.items && authzn && this.showList(models) }
        <Router history={history}>
          <div>
            <PrivateRoute path={`${url}/:id`} component={detailsPage} />
          </div>
        </Router>
      </div>
    )
  }

/*  handleDeleteModel(id) {
    console.log('Deleting Permission with id: ', id)
    //return (e) => this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  } */
  showList(models){
    //const { authzn } = this.props
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Operations</th>
          <th>Resource</th>
          <th>Conditions</th>
          <th>Description</th>
          <th>Actions {this.addLink()}</th>
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
            { this.showActions(model) }
          </tr>)}
      </tbody>
    </Table>
  }

  addLink() {
    const { authzn } = this.props
    return authzn.allowsAdd ?
      <Link to={{ pathname: `${url}/0`, state: this.newModel() }} title="Add"><MdAdd/></Link> :
      ''
  }

  newModel() {
    return {
      model: {
        id: 0,
        condition:'',
        description: ''
      }
    }
  }

  showActions(model) {
    const { authzn } = this.props
    return <td>
            <Link
              to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
              title={authzn.allowsEdit?"Edit":"View"}
            >{authzn.allowsEdit?<MdEdit/>:<MdVisibility/>}</Link>
            <Button
              color="link"
              title="Delete"
              onClick={() => this.handleDeleteModel(model.id)}
              hidden={!authzn.allowsDelete}
            ><MdDelete color="red"/></Button>
          </td>
  }

  handleDeleteModel(id) {
    if( window.confirm('Are you sure?') ) {
      console.log('Delete confirmed')
      this.props.dispatch(actions.delete(id))
      this.props.dispatch(actions.getAll()) // get list after deletion of a model
    }
  }


}

function mapStateToProps(state) {
  const { permissions, alert, authorizations } = state
  // const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    permissions,
    alert,
    authzn
  }
}

const connectedPermissionsPage = connect(mapStateToProps)(PermissionsPage)
export { connectedPermissionsPage as PermissionsPage }
