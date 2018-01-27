import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { Router } from 'react-router-dom'

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
import { roleActions as actions } from '../_actions'
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
    const { authzn } = this.props
    console.log('authzn in roles page: ', authzn)
/*    console.log('user in roles page: ', user)
    let userInStorage = JSON.parse(localStorage.getItem('user'))
    console.log('user in storage: ', userInStorage)
    let authzns = sessionStorage.getItem('authorizations')
    console.log('authorizations in localStorage: ', authzns)
    console.log('localStorage keys', localStorage.keys) */
    let newModel = {
      model: {
        id: 0,
        name: '',
        inherits:'',
        description: ''
      }
    }
//    let addLink = ''
    let addLink = authzn.allowsCreate ?
      <Link to={{ pathname: `${url}/0`, state: newModel }} title="Add"><MdAdd/></Link> :
      ''
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Role Name</th>
          <th>Description</th>
          <th>Inherits</th>
          <th>Actions {addLink}
          </th>
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
                to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
                title={authzn.allowsEdit?"Edit":"View"}
              ><MdVisibility/></Link>
              <Button
                color="link"
                title="Delete"
                onClick={() => this.handleDeleteModel(model.id)}
                hidden={!authzn.allowsDelete}
              ><MdDelete color="red"/></Button>
            </td>
          </tr>)}
      </tbody>
    </Table>
  }

  render() {
    console.log('Props in RolesPage: ', this.props)
    const {  roles, alert } = this.props
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
  const { roles, alert, authorizations } = state
//  const { user } = authentication
  const authzn = authorizations.roles
  return {
//    user,
    roles,
    alert,
    authzn
  }
}

const connectedRolesPage = connect(mapStateToProps)(RolesPage)
export { connectedRolesPage as RolesPage }
