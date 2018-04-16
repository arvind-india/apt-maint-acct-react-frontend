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
import { Fee } from './Fee'

let url = '/accounts'
let module = 'accounts'

export class MonthlyFees extends React.Component {

  constructor(props) {
    super(props)
    this.today = new Date()
    //let accounts = props.accounts && props.accounts.items ? props.accounts.items : []
    this.state = {
      accounts: props.accounts.items,
      forMonth: this.today.getMonth(),
      forYear: this.today.getFullYear(),
      feeChanged: false
    }
//    this.remittances = []
    this.handleChange = this.handleChange.bind(this)
    this.handleFeePaid = this.handleFeePaid.bind(this)
    this.handleFeePaidOn = this.handleFeePaidOn.bind(this)
    this.handleFeeCancel = this.handleFeeCancel.bind(this)
//    this.remittanceAccount = this.remittanceAccount.bind(this)
  }

  componentDidMount() {
    const { forMonth, forYear } = this.state
    this.props.getMonthlyAccountsFor(forMonth+1, forYear)
    this.props.getAllFlats()
  }

  render() {
    const { flats, alert, authzn, trackHistory } = this.props
    const { accounts } = this.state
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Monthly Maintenance Fees Collection</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        <div className="moYr">
          { this.showMonth() }
          { this.showYear()}
        </div>
        { accounts && flats.items && authzn && this.showFlatsGrid() }
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
    this.setState( { [name]: value }, this.getAccounts )
  }
  showFlatsGrid(){
    const { flats, authzn } = this.props
    const { accounts } = this.state
    //const paid = this.paidStatus()
    console.log('MonthlyFeesPage::showFlatsGrid().........')
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          //let account = this.remittanceAccount(flat.flat_number)
          let account = accounts.find((acct) => acct.flat_number === flat.flat_number)
          console.log('account for flat #'+flat.flat_number); console.log('account: ', account)
          if(!account || account.id === 0) {
            account = this.newModel(flat.flat_number)
            accounts.push(account)
          }
          return <li
            key={flat.id}
            className="box"
            role="button">
              <Fee
                flatNumber={flat.flat_number}
                account={account}
                authzn={authzn}
                cancel={this.handleFeeCancel}
                paid={this.handleFeePaid}
                paidOn={this.handleFeePaidOn}
              />
          </li>
        })
      }
    </ul>
  }

  handleFeePaid(flatNumber) {
    const { accounts } = this.state
    console.log('handleFeePaid for '+flatNumber)
    let acct = accounts.find((each) => each.flat_number === flatNumber)
    if(acct) {
      console.log('Saving New Account Details for '+flatNumber)
      this.props.saveChanges(acct)
    } else {
      console.error('No account details for '+flatNumber)
    }
  }
  handleFeeCancel(account) {
    console.log('handleFeeCancel for '+account.flat_number)
    this.props.delete(account.id)
  }
  handleFeePaidOn(newDate, account) {
    account.recorded_at = newDate
    if(account.id > 0) {
      console.log('New Account added with fee paid on as '+account.recorded_at)
      this.props.saveChanges(account)
    } else {
      const { accounts } = this.state
      let acct = accounts.find((each) => each.id === account.id)
      if(acct) {
        acct.recorded_at = newDate
        console.log('Existing account updated for recorded_at as '+newDate)
      }
    }
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
  }

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
