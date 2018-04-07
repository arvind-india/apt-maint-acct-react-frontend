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
import { residentActions as actions, userActions } from '../_actions'
import { default as detailsPage } from './ResidentDetailsPage'

let url = '/residents'
let module = 'residents'

export class Residents extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    //this.props.dispatch(actions.getAll())
    //this.props.dispatch(userActions.getAll())
    this.props.getAll()
    this.props.getAllUser()
  }

  render() {
    //console.log('Props in ResidentsPage: ', this.props)
    const { residents, alert, authzn, users, trackHistory } = this.props
    let models = residents
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Residents List</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        {models.loading && <em>Loading models...}</em>}
        {models.error && <span className="text-danger">ERROR: {models.error}</span>}
        {models.items && authzn && users.items && this.showList() }
        <Router history={hist}>
          <div>
            <PrivateRoute path={`${url}/:id`} component={detailsPage} />
          </div>
        </Router>
      </div>
    )
  }

/*
  handleDeleteModel(id) {
    console.log('Deleting Resident with id: ', id)
    //return (e) => this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  } */
  showList(){
    const { residents } = this.props
    let models = residents
    // make userId -> name array

    return <Table>
      <thead>{ this.headerRow() }</thead>
      <tbody>
        {models.items.map((model, index) => this.bodyRow(model, index))}
      </tbody>
    </Table>
  }
  headerRow() {
    return <tr>
      <th>#</th>
      <th>User Name</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Type</th>
      <th>Occupied On</th>
      <th>Vacated On</th>
      <th>Actions {this.addLink()}</th>
    </tr>
  }
  bodyRow(model, index) {
    const { users } = this.props
    let userNames = []
    //console.log('users : ', users)
    users.items.forEach(each => userNames[each.id] = each.name)
    //console.log('userNames: ', userNames)

    return <tr key={model.id}>
      <th scope="row">{index+1}</th>
      <td>{userNames[model.owner_id]}</td>
      <td>{model.first_name}</td>
      <td>{model.last_name}</td>
      <td>{model.is_a}</td>
      <td>{model.occupied_on}</td>
      <td>{model.vacated_on}</td>
      { this.showActions(model) }
    </tr>
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
        owner_id: 0,
        first_name:'',
        last_name: '',
        is_a: '',
        occupied_on: '',
        vacated_on: ''
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
      this.props.getAll() // get list after deletion of a model
    }
  }


}

function mapStateToProps(state) {
  const { residents, alert, authorizations, users } = state
  // const { user } = authentication
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
//    user,
    residents,
    alert,
    authzn,
    users,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAll: () => {
      dispatch(actions.getAll())
    },
    getAllUser: () => {
      dispatch(userActions.getAll())
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

//const connectedResidentsPage = connect(mapStateToProps)(ResidentsPage)
//export { connectedResidentsPage as ResidentsPage }
export default connect(mapStateToProps, mapDispatchToProps)(Residents)
