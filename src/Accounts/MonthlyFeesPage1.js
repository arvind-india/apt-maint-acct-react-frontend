import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { Router } from 'react-router-dom'
import Select from 'react-select';
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
import { default as detailsPage } from './AccountDetailsPage'
import { DEFAULTS, MONTHS } from '../_constants'
import './MonthlyFeesPage.css'
import {
  accountActions as actions,
  userActions,
  durationActions,
  flatActions
} from '../_actions'
import { default as Fee } from './Fee'

let url = '/accounts'
let module = 'accounts'

export class MonthlyFees extends React.Component {

  constructor(props) {
    super(props)
    this.today = new Date()
    this.state = {
      forMonth: this.today.getMonth(),
      forYear: this.today.getFullYear(),
      // accounts: props.accounts
    }
//    this.remittances = []
    this.handleChange = this.handleChange.bind(this)
    this.getMonthlyAccounts = this.getMonthlyAccounts.bind(this)
    this.handleAccountPayment = this.handleAccountPayment.bind(this)
    this.handleAccountUpdate = this.handleAccountUpdate.bind(this)
    this.handleAccountDelete = this.handleAccountDelete.bind(this)
//    this.handleFeePaid = this.handleFeePaid.bind(this)
//    this.handleFeePaidOn = this.handleFeePaidOn.bind(this)
//    this.handleFeeCancel = this.handleFeeCancel.bind(this)
//    this.remittanceAccount = this.remittanceAccount.bind(this)
  }

  componentDidMount() {
    const { forMonth, forYear } = this.state
    this.props.getMonthlyAccountsFor(forMonth+1, forYear)
    this.props.getAllFlats()
  }

  render() {
    const { flats, alert, authzn, trackHistory, accounts } = this.props
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Monthly Maintenance Fees Collection</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <div className="moYr">
          { this.showMonth() }
          { this.showYear()}
        </div>
        { accounts && accounts.loading && <div>loading...</div>}
        { accounts.items && flats.items && authzn && this.showFlatsGrid() }
      </div>
    )
  }

  showMonth() {
    const { forMonth } = this.state
    return <Select
      id="forMonth"
      name="forMonth"
      value={forMonth+1}
      multi={false}
      joinValues={false}
      simpleValue={true}
      placeholder="Select a Month..."
      onChange={this.handleChange}
      valueKey="number"
      labelKey="name"
      options={MONTHS}
    />
  }

  showYear() {
    const { forYear } = this.state
    return <Input
      id="forYear"
      type="number"
      name="forYear"
      value={forYear}
      placeholder="Year here"
      className="inputField"
      min="2013"
      max="2030"
      onChange={this.handleChange}
    />
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState( { [name]: value }, this.getMonthlyAccounts )
  }
  showFlatsGrid(){
    const { flats, authzn, accounts } = this.props
    // const { accounts } = this.state
    console.log('MonthlyFeesPage::showFlatsGrid().........', accounts)
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          let account = accounts.items.find((acct) => acct.flat_number === flat.flat_number)
          // console.log('account for flat #'+flat.flat_number); console.log('account: ', account)
          return <li
            key={flat.id}
            className="box"
            role="button">
              <Fee
                flatNumber={flat.flat_number}
                account={account}
                refresh={this.getMonthlyAccounts}
                onPayment={() => this.handleAccountPayment(account)}
                onUpdate={(acct) => this.handleAccountUpdate(acct)}
                onDelete={() => this.handleAccountDelete(account.id)}
              />
          </li>
        })
      }
    </ul>
  }

  getMonthlyAccounts() {
    const { forMonth, forYear } = this.state
    this.props.getMonthlyAccountsFor(forMonth+1, forYear)
  }
  handleAccountPayment(account) {
    if(window.confirm('Are you sure to add payment?')) {
      this.props.saveChanges(account)
      this.getMonthlyAccounts()
    }
  }
  handleAccountUpdate(account) {
    this.props.saveChanges(account)
  }
  handleAccountDelete(accountId) {
    if(window.confirm('Are you sure to Remove?')) {
      this.props.delete(accountId)
      this.getMonthlyAccounts()
    }
  }
/*
  handleFeePaid(account) {
    const { forMonth, forYear } = this.state
    console.log('save new account ', account)
    this.props.saveChanges(account)
    this.props.getMonthlyAccountsFor(forMonth+1, forYear)
    console.log('new accounts list: ', this.props.accounts)
    if(this.props.accounts.items) {
      console.log('setting new accounts in to local state....')
      this.setState({
        accounts: this.props.accounts
      })
    } else {
      console.log('no setting of new accounts: ', this.props.accounts)
    }
  }
  handleFeeCancel(accountId) {
    const { forMonth, forYear } = this.state
    console.log('delete account id ', accountId)
    this.props.delete(accountId)
    // this.props.getMonthlyAccountsFor(forMonth+1, forYear)
  }
  handleFeePaidOn(account) {
    console.log('Save new paid date ', account)
    this.props.saveChanges(account)
  }


  newModel(flat_number) {
    const { forMonth, forYear } = this.state
    let newAccountModel = {
      id: 0,
      recorded_at: this.today.toISOString().substr(0,10),
      item: 'Monthly Maintenance Fee',
      flat_number: flat_number,
      name: flat_number+' Resident',
      for_month: forMonth+1,
      for_year: forYear,
      crdr: 'cr',
      amount: '600',
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Paid monthly maintenance'
    }
    return newAccountModel
  } */

} // end of class

function mapStateToProps(state) {
  const { accounts, alert, authorizations, users, flats } = state
  const authzn = authorizations[module]
  const trackHistory = true  // added for unit testing; snapshot to be precise
  return {
    accounts,
    alert,
    authzn,
    users,
    flats,
    trackHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllFlats: () => {
      dispatch(flatActions.getAll())
    },
/*    getAccountsFor: (fromDate, toDate) => {
      dispatch(actions.getListFor(fromDate, toDate))
    }, */
    getMonthlyAccountsFor: (month, year) => {
      dispatch(actions.getMonthlyListFor(month, year))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyFees)
