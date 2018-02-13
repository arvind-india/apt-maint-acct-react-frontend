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
import { userActions as actions } from '../_actions'
import { UserDetailsPage as detailsPage } from './UserDetailsPage'

let url = '/users'
let module = 'users' // module name

class UsersPage extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(actions.getAll())
  }

  render() {
    const { users, alert, authzn } = this.props
    let models = users
    console.log('Users: ', users)
    return (
      <div>
        <h3>Users List</h3>
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
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  } */
  showList(models){
    //const { authzn } = this.props
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>First Name</th>
          <th>Email</th>
          <th>Actions {this.addLink()}</th>
        </tr>
      </thead>
      <tbody>
        {models.items.map((model, index) => this.showRow(model, index))}
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
        name: '',
        first_name:'',
        last_name: '',
        email: '',
        infos: []
      }
    }
  }
  showRow(model, index) {
    const { user, authzn } = this.props
    console.log('Users page >>> showRow()...........', model)
    console.log('user is: ', user)
    console.log('authzn is: ', authzn)
    return <tr key={model.id}>
      <th scope="row">{index+1}</th>
      <td>{model.name}</td>
      <td>{model.first_name}</td>
      <td>{model.email}</td>
      { this.showActions(model) }
    </tr>
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
  const { users, alert, authorizations, authentication } = state
  const { user } = authentication
  const authzn = authorizations[module]
  return {
    user,
    users,
    alert,
    authzn
  }
}

const connectedUsersPage = connect(mapStateToProps)(UsersPage)
export { connectedUsersPage as UsersPage }
