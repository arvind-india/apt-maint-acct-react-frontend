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
import { durationActions as actions } from '../_actions'
import { default as detailsPage } from './DurationDetailsPage'

let url = '/durations'
let module = 'durations'

export class Durations extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.getAll()
  }

  render() {
    const { durations, alert, authzn, trackHistory } = this.props
    let models = durations
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Durations List</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        {models.loading && <em>Loading models...}</em>}
        {models.error && <span className="text-danger">ERROR: {models.error}</span>}
        {models.items && authzn && this.showList() }
        <Router history={hist}>
          <div>
            <PrivateRoute path={`${url}/:id`} component={detailsPage} />
          </div>
        </Router>
      </div>
    )
  }

  showList(){
    const { durations } = this.props
    let models = durations
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
      <th>Key</th>
      <th>Value</th>
      <th>Effective From</th>
      <th>Effective To</th>
      <th>Actions {this.addLink()}</th>
    </tr>
  }
  bodyRow(model, index) {
    return <tr key={model.id}>
      <th scope="row">{index+1}</th>
      <td>{model.key}</td>
      <td>{model.value}</td>
      <td>{model.effective_from}</td>
      <td>{model.effective_to}</td>
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
        key:'',
        value: '',
        effective_from: '',
        effective_to: '',
        remarks: ''
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
      this.props.delete(id)
      this.props.getAll() // get list after deletion of a model
    }
  }

}

function mapStateToProps(state) {
  const { durations, alert, authorizations } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    durations,
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

export default connect(mapStateToProps, mapDispatchToProps)(Durations)
