import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

import { durationActions, flatActions, accountMonthlyActions as actions } from '../_actions'

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

import './MonthlyAccounts.css'

let url = '/accounts'
let module = 'accounts'

export class MonthlyAccounts extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      forMonth: 4,
      forYear: 2018
    }
  }
  componentDidMount() {
    const { forMonth, forYear } = this.state
    this.props.getAllFlats()
    this.props.getMonthlyListFor({month: forMonth, year: forYear})
  }
  render() {
    const { flats, accounts } = this.props
    return <div>
              <h3>Monthly Maintenance Fees Collection</h3>
              { flats.loading && <div>loading flats...</div>}
              { flats.error && <span className="text-danger">{flats.error}</span>}
              { accounts.loading && <div>loading accounts...</div>}
              { accounts.error && <span className="text-danger">{accounts.error}</span>}
              { accounts.items && flats.items && this.showList() }
           </div>
  }

  newAccount(flatNumber) {
    return {
      id: 0,
      recorded_at: new Date().toISOString().substr(0,10),
      item: 'Monthly Maintenance Fee',
      flat_number: flatNumber,
      name: flatNumber+' Resident',
      for_month: this.state.forMonth,
      for_year: this.state.forYear,
      crdr: 'cr',
      amount: '600',
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Paid monthly maintenance'
    }
  }

  showList(){
    const { flats } = this.props
    let models = flats
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
      <th>Flat#</th>
      <th>Paid?</th>
      <th>Paid On</th>
    </tr>
  }

  bodyRow(model,index) {
    let flatNum = model.flat_number
    let acct = this.getAccountOn(flatNum)
    let today = new Date().toISOString().substr(0,10)
    // <td>{acct && acct.id > 0?acct.recorded_at:today}</td>
    return <tr key={model.id}>
      <td>{index+1}</td>
      <td>{model.flat_number}</td>
      {acct && this.showPaidStatus(acct)}
      {acct && this.showPaidDate(acct)}
    </tr>
  }
  getAccountOn(flatNum) {
    const { accounts } = this.props
    let acct = accounts.items.find((each) => each.flat_number === flatNum)
    return acct ? acct : this.newAccount(flatNum)
  }
  showCheckbox() {
    return <div class="checkboxThree">
      <input type="checkbox" value="1" id="checkboxThreeInput" name="" />
      <label for="checkboxThreeInput"></label>
    </div>
  }
  showPaidStatus(account) {
    let suffix = account.flat_number
    let id="paidStatus"+suffix
    return <td>
      <div class="paidStatus">
        <Input
          id={id}
          type="checkbox"
          name=""
          value={1}
          checked={account && account.id > 0}
          onChange={() => this.handlePaidStatus(account)}
        /> <label for={id}></label>
      </div>
    </td>
  }
  handlePaidStatus(account) {
    if(account.id > 0) {
      this.handleDeleteModel(account)
    } else {
      this.handleAddModel(account)
    }
  }
  handleAddModel(model) {
    if(window.confirm('Are you sure to add this payment?')) {
      this.props.saveChanges(model)
    }
  }
  handleDeleteModel(model) {
    if( window.confirm('Are you sure to remove this payment?') ) {
      this.props.delete(model)
    }
  }
  showPaidDate(account) {
    const { editDate } = this.state
    return editDate ?
      this.showDateInput(account) :
      this.showDate(account)
  }
  showDate(account) {
    return <div
        className="paid-date"
        role="button"
        onClick={this.handleDateClick}
        style={this.getStyle()}
      >{account.recorded_at}</div>
  }
  getStyle() {
    const { authzn } = this.props
    return authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
      { cursor: "pointer" } :
      { cursor: "default" }
  }  
  handleDateClick() {
    const { authzn } = this.props
    if(!authzn) return;
    if(authzn.allowsAdd || authzn.allowsEdit) {
      this.setState({editDate: true})
    }
  }
  showDateInput(account) {
    return <div className="paid-date">
      <Input
        id="recordedAt"
        type="date"
        name="recorded_at"
        value={account.recorded_at}
        onChange={(event) => this.handleDateChange(event, account)}
      />
      <Button
        size="sm"
        color="danger"
        title="Cancel"
        onClick={() => this.setState({editDate: false})}
      >x</Button>
    </div>
  }
  handleDateChange(event, account) {
    const { name, value } = event.target
    this.setState({
      editDate: false
    },
    ()=>this.saveDateChange(account, value))
  }
  saveDateChange(account, newDate) {
    if(acct.id === 0) return ;  // do nothing for new account
    let acct = account
    acct.recorded_at = newDate
    console.log('saving account with new date: ', acct)
    this.props.saveChanges(acct)
  }

} // end of class MonthlyAccounts

function mapStateToProps(state) {
  const { alert, authorizations, flats, accountsMonthly } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  const accounts = accountsMonthly
  return {
    accounts,
    alert,
    authzn,
    flats,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllFlats: () => {
      dispatch(flatActions.getAll())
    },
    getMonthlyListFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (model) => {
      dispatch(actions.delete(model))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccounts)
