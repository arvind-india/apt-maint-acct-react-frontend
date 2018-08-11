import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { Router } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import {
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete
} from 'react-icons/lib/md' // material design icons

import {
  Button
} from 'reactstrap'

import { history, RowAuthorization } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { userActions as actions } from '../_actions'
import { default as detailsPage } from './UserDetailsPage'

let url = '/users'
let module = 'users' // module name

export class Users extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.getAll()
  }

  render() {
    const { users, alert, authzn, trackHistory } = this.props
    let models = users
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Users List</h3>
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

  showList(models){
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
      },
      title: 'User Details'
    }
  }
  showRow(model, index) {
    const { authzn } = this.props

    let row = <tr key={model.id}>
      <th scope="row">{index+1}</th>
      <td>{model.name}</td>
      <td>{model.first_name}</td>
      <td>{model.email}</td>
      { this.showActions(model) }
    </tr>

    if(!authzn.condition) return row

    if(this.isAuthorizedRow(model)) return row
    // nothing to return at this end
  }
  isAuthorizedRow(model) {
    const { user, authzn } = this.props
    let data = {
      user_id: user.id,
      model: { owner_id: model.id}
    }
    let evaluations = authzn.condition.split(',').filter(condition => {
      let rowAuthzn = new RowAuthorization(condition, data);
      return rowAuthzn.evaluate(); // returns boolean value
    });
    return evaluations.length > 0;
  }
  showActions(model) {
    const { authzn } = this.props
    return <td>
            <Link
              to={{ pathname: `${url}/${model.id}`, state:{model: model, title: 'User Details'} }}
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
      this.props.delete(id)
      this.props.getAll() // get list after deletion of a model
    }
  }

}

function mapStateToProps(state) {
  const { users, alert, authorizations, authentication, authenticationSocial } = state
  let id_token = authentication && authentication.user ?
                    authentication.user.id_token :
                    authenticationSocial.user.id_token
  //const user = jwtDecode(authentication.user.id_token) // logged user
  const user = jwtDecode(id_token) // logged user
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    user,
    users,
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

export default connect(mapStateToProps, mapDispatchToProps)(Users)
