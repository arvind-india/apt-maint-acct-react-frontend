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
import { flatActions as actions } from '../_actions'
import { default as detailsPage } from './FlatDetailsPage'

let url = '/flats'
let module = 'flats'

export class Flats extends React.Component {

  constructor(props) {
    super(props)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    this.props.getAll()
  }

  handleDeleteModel(id) {
    this.props.delete(id)
    this.props.getAll()
  }

  showList(models){
    const { authzn } = this.props

    let newModel = {
      model: {
        id: 0,
        block_number:'',
        flat_number: '',
        max_owners: 1,
        max_tenants: 0
      }
    }
    let addLink = authzn.allowsAdd ?
      <Link to={{ pathname: `${url}/0`, state: newModel }} title="Add"><MdAdd/></Link> :
      ''
    let ownerStr = "Max. no. of owners of this flat need online access";
    let tenantStr = "Max. no. of tenants of this flat need online access";
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Block Number</th>
          <th>Flat Number</th>
          <th title={ownerStr}>Max. Owners</th>
          <th title={tenantStr}>Max. Tenants</th>
          <th>Actions {addLink}</th>
        </tr>
      </thead>
      <tbody>
        {models.items.map((model, index) =>
          <tr key={model.id}>
            <th scope="row">{index+1}</th>
            <td>{model.block_number}</td>
            <td>{model.flat_number}</td>
            <td>{model.max_owners}</td>
            <td>{model.max_tenants}</td>
            <td>
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
          </tr>)}
      </tbody>
    </Table>
  }

  render() {
    const { flats, alert, authzn, trackHistory } = this.props
    let models = flats
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Flats List</h3>
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
}

function mapStateToProps(state) {
  const { flats, alert, authorizations } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    flats,
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

export default connect(mapStateToProps, mapDispatchToProps)(Flats)
