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
import './accounts.css'
import {
  accountActions as actions,
  userActions,
  durationActions,
  flatActions
} from '../_actions'


let url = '/accounts'
let module = 'accounts'

export class MaintenanceFeeCollections extends React.Component {

  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      forMonth: today.getMonth()+1,
      forYear: today.getFullYear()
    }
    this.handleChange = this.handleChange.bind(this)
  }

  fromDate() {
    const { forMonth, forYear } = this.state
    return new Date(forYear, forMonth, 1)
  }

  toDate() {
    const { forMonth, forYear } = this.state
    let day = this.noOfDays()
    console.log('No of days in '+forMonth+' month is: '+day)
    return new Date(forYear, forMonth, day)
  }

  noOfDays() {
    const { forMonth, forYear } = this.state
    switch(forMonth) {
      case 1: case 3:  case 5: case 7: case 8: case 10: case 12:
        return 31
      case 4: case 6: case 9: case 11:
        return 30
      case 2:
        return forYear%4 ? 28 : 29
    }
  }

  componentDidMount() {
    this.props.getAccountsFor(this.fromDate(), this.toDate())
    this.props.getAllFlats()
  }

  render() {
    const { accounts, flats, alert, authzn, trackHistory } = this.props
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Maintenance Fee Collections</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        { this.showMonth() }
        { this.showYear()}
        {flats.items && authzn && this.showFlatsGrid() }
      </div>
    )
  }

  showMonth() {
    const { forMonth } = this.state
    return <Select
      id="forMonth"
      name="forMonth"
      value={forMonth}
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
    const { flats } = this.props
    const paid = this.paidStatus()
    return <ul className="grid">
      {flats.items.map( (flat, index) =>
        <li
          key={flat.id}
          className="box"
          role="button">
            { this.showFlatNumber(flat.flat_number, paid[flat.flat_number]) }
            { this.showPaidStatus(flat, paid[flat.flat_number]) }
            { this.showPaidDate(flat, paid[flat.flat_number]) }
        </li>
      )}
    </ul>
  }
  showFlatNumber(flat_number, accountModel) {
    const { authzn } = this.props
    let model = accountModel ? accountModel : this.newModel(flat_number)
    let title = authzn.allowsAdd && model.id === 0 ? 'Add' :
      authzn.allowsEdit ? 'Edit' : 'View'
    return <Link
      to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
      title={title}>{flat_number}</Link>
  }
  showPaidStatus(flat, accountModel) {
    let status = accountModel? <span>&#10004; Paid</span> : <span>x</span>
    return <div
      className="payment"
      role="button"
      onClick={event => this.toggleRemittance(event, accountModel)}
      >{status}</div>
  }
/*  showPaidDate(flat, accountModel) {
    let date = accountModel ? <span>{accountModel.recorded_at}</span> : <span>-</span>
    return <div
      className='recorded-at'
      >{date}</div>
  } */
  showPaidDate(flat, accountModel) {
    let date = accountModel ? accountModel.recorded_at : null
    return <Input
      id="recorded_at"
      type="date"
      name="recorded_at"
      value={date}
      className="inputField"
      onChange={(event) => this.updatePaidDate(event, accountModel)}
    />
  }
  paidStatus() {
    // builds association between flat number and remittance made for that flat
    // null if no remittance made for a flat in the month and year
    const { flats } = this.props
    const remittances = this.remittances()
    let results = {}
    flats.items.map((flat) => {
      let pflat = remittances.find((each) => each.flat_number === flat.flat_number)
      results[flat.flat_number] = pflat ? pflat : null
    })
    return results
  }
  remittances() {
    // Answers accounts with monthly maintenance fee remitted for the month, year
    const { accounts } = this.props
    const { forMonth, forYear } = this.state
    if(!accounts.items) return []
    let remittances = accounts.items.filter( (acct) =>
      acct.category === "Monthly Maintenance" &&
      acct.for_month === forMonth &&
      acct.for_year  === forYear)
    return remittances
  }

  toggleRemittance(event, accountModel) {
    const { authzn } = this.props
    if(!authzn.allowsAdd && !authzn.allowsEdit) {
      return null // no authorization for add or edit, then do nothing, just return
    }
    if (accountModel) {
      if (window.confirm('Confirm REMOVAL of PAID status')) {
        console.log('Removal confirmed')
        this.props.delete(accountModel.id)
      }
    } else {
      let newModel = this.newModel(accountModel.flat_number)
      if (window.confirm('Confirm ADDITION of PAID status')) {
        console.log('Addition confimed')
        this.props.saveChanges(newModel)
      }
    }
  }
  newModel(flat_number='') {
    const { forMonth, forYear } = this.state
    let today = new Date().toISOString().split('T')[0];
    return {
      id: 0,
      recorded_at: today,
      item: 'Monthly Maintenance Fee',
      flat_number: flat_number,
      name: '',
      for_month: forMonth,
      for_year: forYear,
      crdr: 'cr',
      amount: '600',
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Remitting monthly maintenance'
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
    getAccountsFor: (fromDate, toDate) => {
      dispatch(actions.getListFor(fromDate, toDate))
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

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceFeeCollections)
