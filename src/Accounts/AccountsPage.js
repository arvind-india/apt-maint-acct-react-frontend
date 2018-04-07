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
  Button,
  Input,
  Label
} from 'reactstrap'

import { history } from '../_helpers'
import { PrivateRoute, FlashMessage } from '../_components'
import { accountActions as actions, userActions } from '../_actions'
import { default as detailsPage } from './AccountDetailsPage'
import { DEFAULTS } from '../_constants'

let url = '/accounts'
let module = 'accounts'

export class Accounts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fromDate: this.fromDate(),
      toDate: this.toDate()
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }
  fromDate() {
    // let date = sessionStorage.getItem('fromDate')
    let date = this.props.getSessionStorage('fromDate')
    if(!date) {
      date = this.date(DEFAULTS.AccountsInMonths)
    }
    return date
  }

  toDate() {
    // let date = sessionStorage.getItem('toDate')
    let date = this.props.getSessionStorage('toDate')
    if(!date) {
      date = this.date()
    }
    return date
  }

  date(deduct=0) {
    let today = new Date()
    if(deduct > 0) {
      let month = today.getMonth()
      today.setMonth(month - deduct)
    }
    return today.toISOString().split('T')[0]
  }

  componentDidMount() {
    this.getAccounts()
    //this.props.dispatch(userActions.getAll())
    this.props.getAll()
  }

  render() {
    const { accounts, alert, authzn, users, trackHistory } = this.props
    let models = accounts
    let hist = trackHistory?history:{}
    // {alert.message && <FlashMessage text={alert.message} delay={3000}/>}
    return (
      <div>
        <h3>Accounts List</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <div className="grid-form">{ this.showDates() }</div>
        {models.items && authzn && users.items && this.showList() }
        <Router history={hist}>
          <div>
            <PrivateRoute path={`${url}/:id`} component={detailsPage} />
          </div>
        </Router>
      </div>
    )
  }

  showDates() {
    const { fromDate, toDate } = this.state
    return <div data-row-span="6">
      <div data-field-span="1">
        <Label>From</Label>
        <Input
          type="date"
          name="fromDate"
          value={fromDate}
          placeholder="Accounts from this date"
          onChange={this.handleChange}
        />
      </div>
      <div data-field-span="1">
        <Label>To</Label>
        <Input
          type="date"
          name="toDate"
          value={toDate}
          placeholder="Accounts from this date"
          onChange={this.handleChange}
        />
      </div>
    </div>
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState( { [name]: value }, this.getAccounts )
  }
  getAccounts() {
    const { fromDate, toDate } = this.state
    //const { dispatch } = this.props
    //sessionStorage.setItem('fromDate', fromDate)
    this.props.setSessionStorage('fromDate', fromDate)
    //sessionStorage.setItem('toDate', toDate)
    this.props.setSessionStorage('toDate', toDate)
    //dispatch(actions.getListFor(fromDate, toDate))
    this.props.getListFor(fromDate, toDate)
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
    if( window.confirm('Are you sure?') ) {
      //this.props.dispatch(actions.delete(id))
      //this.props.dispatch(actions.getListFor(fromDate, toDate))
      this.props.delete(id)
      this.props.getListFor(fromDate, toDate)
    }
  }

}

function mapStateToProps(state) {
  const { accounts, alert, authorizations, users } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    accounts,
    alert,
    authzn,
    users,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAll: () => {
      dispatch(userActions.getAll())
    },
    getListFor: (fromDate, toDate) => {
      dispatch(actions.getListFor(fromDate, toDate))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    },
    setSessionStorage: (key, value) => {
      sessionStorage.setItem(key, value)
    },
    getSessionStorage: (key) => {
      sessionStorage.getItem(key)
    }
  }
}

//const connectedAccountsPage = connect(mapStateToProps)(AccountsPage)
//export { connectedAccountsPage as AccountsPage }
export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
