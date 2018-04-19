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
  accountMonthlyActions as actions,
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
    this.state = {
      forMonth: this.today.getMonth(),
      forYear: this.today.getFullYear(),
    }
    this.handleChange = this.handleChange.bind(this)
    //this.getMonthlyAccounts = this.getMonthlyAccounts.bind(this)
    this.handleAccountPayment = this.handleAccountPayment.bind(this)
    this.handleAccountUpdate = this.handleAccountUpdate.bind(this)
    this.handleAccountDelete = this.handleAccountDelete.bind(this)
  }

  componentDidMount() {
    this.getMonthlyAccounts()
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
    console.log('MonthlyFeesPage::showFlatsGrid().........', accounts)
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          let account = accounts.items.find((acct) => acct.flat_number === flat.flat_number)
          return <li
            key={flat.id}
            className="box"
            role="button">
              <Fee
                flatNumber={flat.flat_number}
                account={account}
                authzn={authzn}
                onPayment={() => this.handleAccountPayment(account)}
                onUpdate={(acct) => this.handleAccountUpdate(acct)}
                onDelete={() => this.handleAccountDelete(account.id)}
              />
          </li>
        })
      }
    </ul>
  }
  moYrData() {
    const { forMonth, forYear } = this.state
    return {
      month: forMonth+1,
      year: forYear
    }
  }
  getMonthlyAccounts() {
    //const { forMonth, forYear } = this.state
    this.props.getMonthlyAccountsFor(this.moYrData())
  }
  handleAccountPayment(account) {
    if(window.confirm('Are you sure to add payment?')) {
      this.props.saveChangesAndGetMonthlyList(account, this.moYrData())
    }
  }
  handleAccountUpdate(account) {
    this.props.saveChangesAndGetMonthlyList(account)
  }
  handleAccountDelete(accountId) {
    if(window.confirm('Are you sure to Remove?')) {
      let result = this.props.delete(accountId)
      console.log('result of handleAccountDelete: ', result)
      //this.getMonthlyAccounts()
    }
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
    getMonthlyAccountsFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    },
/*    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    }, */
    saveChangesAndGetMonthlyList: (model, data) => {
      dispatch(actions.saveChangesAndGetMonthlyList(model, data))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyFees)
