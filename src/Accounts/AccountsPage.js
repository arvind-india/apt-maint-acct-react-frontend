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

class AccountsPage extends React.Component {

  constructor(props) {
    super(props)
    let noOfPrevMonths = 2  // by default show all records in the past 2 months
    let year = new Date().getFullYear();
    year = 2016 // for testing purpose only
    let month = new Date().getMonth() - noOfPrevMonths;
    this.state = {
      modal: false,
      canDelete: false,
      fromDate: new Date(year, month, 1),
      toDate: new Date()
    }
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
//    this.toggleModalDialog = this.toggleModalDialog.bind(this)
//    this.deleteConfirmed = this.deleteConfirmed.bind(this)
  }

  componentDidMount() {
    const { fromDate, toDate } = this.state
    //this.props.dispatch(actions.getAll())
    this.props.dispatch(actions.getListFor(fromDate, toDate))
    this.props.dispatch(userActions.getAll())
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

  showList(){
    const { accounts } = this.props
    let models = accounts
    return <Table>
      <thead>{ this.headerRow() }</thead>
      <tbody>
        { models.items.map((model, index) => this.bodyRow(model,index)) }
      </tbody>
    </Table>
  }

  headerRow() {
    return <tr>
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
      <th>Actions {this.addLink()}</th>
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
        recorded_at: '',
        item: '',
        flat_number:'',
        name: '',
        for_month: '',
        for_year: '',
        crdr: '',
        amount: '',
        balance: '',
        category: '',
        remarks: ''
      }
    }
  }

  bodyRow(model,index) {
    return <tr key={model.id}>
      <td>{index+1}</td>
      <td>{model.recorded_at}</td>
      <td>{model.flat_number}</td>
      <td>{model.name}</td>
      <td>{model.for_month}</td>
      <td>{model.for_year}</td>
      <td>{model.crdr}</td>
      <td>{model.amount}</td>
      <td>{model.balance}</td>
      <td>{model.category}</td>
      {this.showActions(model)}
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
    const { fromDate, toDate } = this.state
    console.log('Deleting Account with id: ', id)

    if( window.confirm('Are you sure?') ) {
      console.log('Delete confirmed')
      this.props.dispatch(actions.delete(id))
      this.props.dispatch(actions.getListFor(fromDate, toDate))
    } else {
      console.log('Delete cancelled!')
    }
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

const connectedAccountsPage = connect(mapStateToProps)(AccountsPage)
export { connectedAccountsPage as AccountsPage }
