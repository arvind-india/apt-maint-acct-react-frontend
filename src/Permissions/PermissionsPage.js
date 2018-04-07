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
import { default as detailsPage } from './PermissionDetailsPage'

let url = '/permissions'
let module = 'permissions'

export class Permissions extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    //this.props.dispatch(actions.getAll())
    this.props.getAll()
  }

  render() {
    //console.log('Props in PermissionsPage: ', this.props)
    const { permissions, alert, authzn, trackHistory } = this.props
    let models = permissions
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Permissions List</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        {models.loading && <em>Loading models...}</em>}
        {models.error && <span className="text-danger">ERROR: {models.error}</span>}
        {models.items && authzn && this.showList(models) }
        <Router history={hist}>
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
      //this.props.dispatch(actions.delete(id))
      //this.props.dispatch(actions.getAll()) // get list after deletion of a model
      this.props.delete(id)
      this.props.getAll()
    }
  }


}

function mapStateToProps(state) {
  const { permissions, alert, authorizations } = state
  // const { user } = authentication
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
//    user,
    permissions,
    alert,
    authzn,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAll: () => {
      dispatch(actions.getAll())
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

//const connectedPermissionsPage = connect(mapStateToProps)(PermissionsPage)
//export { connectedPermissionsPage as PermissionsPage }
export default connect(mapStateToProps, mapDispatchToProps)(Permissions)
