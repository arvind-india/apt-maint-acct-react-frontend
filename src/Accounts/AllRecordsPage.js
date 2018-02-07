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
import { accountActions as actions, userActions } from '../_actions'
import { AccountDetailsPage as detailsPage } from './AccountDetailsPage'

let url = '/accounts'
let module = 'accounts'

class AllRecordsPage extends React.Component {

  constructor(props) {
    super(props)
    let noOfPrevMonths = 2  // by default show all records in the past 2 months
    let year = new Date().getFullYear();
    let month = new Date().getMonth() - noOfPrevMonths;
    this.state = {
      fromDate: new Date(2016, month, 1),
      toDate: new Date()
    }
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }

  componentDidMount() {
    const { fromDate, toDate } = this.state
    //this.props.dispatch(actions.getAll())
    this.props.dispatch(actions.getListFor(fromDate, toDate))
    this.props.dispatch(userActions.getAll())
  }
  handleDeleteModel(id) {
    console.log('Deleting Account with id: ', id)
    //return (e) => this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.delete(id))
    this.props.dispatch(actions.getAll()) // get list after deletion of a model
  }
  showList(){
    const { authzn, accounts, users } = this.props
    let models = accounts
    // make userId -> name array
    let userNames = []
    console.log('accounts models: ', models)
    console.log('users : ', users)
    users.items.forEach(each => userNames[each.id] = each.name)
    console.log('userNames: ', userNames)

    let newModel = {
      model: {
        id: 0,
        recorded_at: 0,
        item: '',
        flat_number:'',
        for_month: '',
        for_year: '',
        crdr: '',
        amount: '',
        balance: '',
        category: '',
        remarks: ''
      }
    }
    let addLink = authzn.allowsAdd ?
      <Link to={{ pathname: `${url}/0`, state: newModel }} title="Add"><MdAdd/></Link> :
      ''
    return <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Txn Date</th>
    			<th>Flat#</th>
    			<th>Name</th>
    			<th>Mth</th>
    			<th>Yr</th>
    			<th>Cr/Dr</th>
          <th>Amt in &#8377;</th>
          <th>&#8377; Balance</th>
          <th>Category</th>
          <th>Actions {addLink}</th>
        </tr>
      </thead>
      <tbody>
        {models.items.map((model, index) =>
          <tr key={model.id}>
            <td scope="row">{index+1}</td>
            <td>{model.recorded_at}</td>
            <td>{model.flat_number}</td>
            <td>{model.name}</td>
            <td>{model.for_month}</td>
            <td>{model.for_year}</td>
            <td>{model.crdr}</td>
            <td>{model.amount}</td>
            <td>{model.balance}</td>
            <td>{model.category}</td>
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
    console.log('Props in AccountsPage: ', this.props)
    const { accounts, alert, authzn, users } = this.props
    let models = accounts
console.log('accounts models: ', models)
    return (
      <div>
        <h3>Accounts List</h3>
        {alert.message && <FlashMessage text={alert.message} delay={5000}/>}
        {models.items && authzn && users.items && this.showList() }
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
  const { accounts, alert, authorizations, users } = state
  // const { user } = authentication
  const authzn = authorizations[module]
  return {
//    user,
    accounts,
    alert,
    authzn,
    users
  }
}

const connectedAllRecordsPage = connect(mapStateToProps)(AllRecordsPage)
export { connectedAllRecordsPage as AllRecordsPage }
