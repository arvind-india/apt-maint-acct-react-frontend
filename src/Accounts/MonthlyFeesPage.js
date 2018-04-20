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
import { default as FeePage } from './FeePage'

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
  }

  componentDidMount() {
    const { flatNumber } = this.props
    const { forMonth, forYear } = this.state
    let data = {
      flatNumber: flatNumber,
      month: forMonth+1,
      year: forYear
    }
    this.props.getMonthlyAccountsFor(data)
    this.props.getAllFlats()
  }

  render() {
    const { flats, alert, authzn, trackHistory, accounts } = this.props
    console.log('accounts: ', accounts)
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
    const { forMonth, forYear } = this.state
    //console.log('MonthlyFeesPage::showFlatsGrid().........', accounts)
    //console.log('Flats: ', flats)
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          let account = accounts.items.find((acct) => acct.flat_number === flat.flat_number)
          console.log('MonthlyFeesPage >> Account: ', account)
          return <li
            key={flat.id}
            className="box"
            role="button">
              <FeePage {...account} />
          </li>
        })
      }
    </ul>
  }
/*
  prepData(flatNumber) {

  }
  getMonthlyAccounts() {
    this.props.getMonthlyAccountsFor(this.prepData())
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
    getMonthlyAccountsFor: (data) => {
      dispatch(actions.getMonthlyListFor(data))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyFees)
