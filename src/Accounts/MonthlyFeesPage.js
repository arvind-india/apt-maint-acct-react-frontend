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
import { default as MonthlyFeePage } from './MonthlyFeePage'

let url = '/accounts'
let module = 'accounts'

export class MonthlyFees extends React.Component {

  constructor(props) {
    super(props)
    this.today = new Date()
    this.state = {
      forMonth: this.today.getMonth(),
      forYear: this.today.getFullYear()
    }
//    this.remittances = []
    this.handleChange = this.handleChange.bind(this)
//    this.remittanceAccount = this.remittanceAccount.bind(this)
  }

/*
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
    // forMonth is in the range of 0 to 11; 0 for Jan, 11 for Dec
    switch(forMonth) {
      case 0: case 2:  case 4: case 6: case 7: case 9: case 11:
        return 31
      case 3: case 5: case 8: case 10:
        return 30
      case 1:
        return forYear%4 ? 28 : 29
    }
  }
*/
  componentDidMount() {
    const { forMonth, forYear } = this.state
/*    let mo = forMonth + 1 // convert to 1 to 12 based months
    let prefix = mo < 10 ? '0' : ''
    let yyyymm = forYear.toString()+'-'+prefix+mo.toString()+'-'
    let from = yyyymm +'01'
    let to = yyyymm + this.noOfDays().toString() */
    //this.props.getAccountsFor(from, to)
    this.props.getMonthlyAccountsFor(forMonth+1, forYear)
    this.props.getAllFlats()
  }

  render() {
    const { accounts, flats, alert, authzn, trackHistory } = this.props
    let hist = trackHistory?history:{}
    return (
      <div>
        <h3>Monthly Maintenance Fees Collection</h3>
        {alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/>}
        { this.showMonth() }
        { this.showYear()}
        { authzn && flats.items && accounts.items && this.showFlatsGrid() }
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
    const { flats, accounts } = this.props
    //const paid = this.paidStatus()
    return <ul className="grid">
      { flats.items.map((flat, index) => {
          //let account = this.remittanceAccount(flat.flat_number)
          let account = accounts.items.find((acct) => acct.flat_number === flat.flat_number)
/*          if(!account) {
            account = this.newModel(flat.flat_number)
          } */
          return <li
            key={flat.id}
            className="box"
            role="button">
              <MonthlyFeePage flat={flat} account={account}/>
          </li>
        })
      }
    </ul>
  }

/*
  showListItem(flat, index) {
    const { accounts } = this.props
    const { forMonth, forYear } = this.state
    //const { editDateForFlat } = this.state
    //let model = accountModel ? accountModel : this.newModel(flat.flat_number)
    let account = this.remittanceAccount(flat.flat_number)
    return <li
      key={flat.id}
      className="box"
      role="button">
        <MonthlyFeePage flat={flat} account={account}/>
    </li>
  }
*/

/*
{ this.showFlatNumber(flat, model) }
{ this.showPaidStatus(flat, model) }
{ this.showPaidDate(flat, model) }
*/

/*
  showFlatNumber(flat, accountModel) {
    const { authzn } = this.props
    //let model = accountModel ? accountModel : this.newModel(flat.flat_number)
    let model = accountModel
    let title = authzn.allowsAdd && model.id === 0 ? 'Add' :
      authzn.allowsEdit ? 'Edit' : 'View'
    return <Link
      to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
      title={title}
      className="flat-number"
      >{flat.flat_number}</Link>
  }
  showPaidStatus(flat, accountModel) {
    let model = accountModel
    let status = model.id > 0 ? <span>&#10004; Paid</span> : <span>x</span>
    return <div
      className="payment"
      role="button"
      onClick={event => this.toggleRemittance(event, model)}
      >{status}</div>
  }

  showPaidDate(flat, accountModel) {
    let model = accountModel
    let date = model.id > 0 ? <span>{model.recorded_at}</span> : <span>{this.payNow}</span>
    return <div
      className='paid-date'
      role="button"
      onClick={() => this.setState({editDateForFlat: flat.flat_number})}
      >{date}</div>
  }

  editPaidDate(flat, accountModel) {
    let model = accountModel
    let date = model.id > 0 ? model.recorded_at : this.payNow
    return <div className="paid-date">
      <Input
        id="recorded_at"
        type="date"
        name="recorded_at"
        value={date}
        className="recorded-at"
        onChange={(event) => this.updatePaidDate(event, model)}
      />
      <Button
        size="sm"
        color="danger"
        title="Cancel"
        onClick={() => this.setState({editDateForFlat: ''})}
      >x</Button>
    </div>
  }

  updatePaidDate(event, accountModel) {
    const { name, value } = event.target
    alert('name: '+name+', value: '+value)
    let flatNumber = accountModel.flat_number
    let model = this.newModel(flatNumber)
    model[name] = value
    this.setState({editDateForFlat: ''})
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

  remittanceAccount(flatNumber) {
    return this.getRemittances().find((each) => each.flat_number === flatNumber)
  }
  getRemittances() {
    console.log('remittances are: ', this.remittances)
    if(this.remittances.length > 1) {
      return this.remittances // return remittances stored in the local variable
    }
    // Answers accounts with monthly maintenance fee remitted for the month, year
    const { accounts } = this.props
    const { forMonth, forYear } = this.state
    console.log('accounts before filter: ', accounts)
    if(!accounts.items) {
      this.remittances = []
      console.log('accounts are empty...')
      return this.remittances
    }
    console.log('accounts ready for filtering...')
    this.remittances = accounts.items.filter( (acct) =>
      acct.category === "Monthly Maintenance" &&
      acct.for_month === forMonth+1 &&
      acct.for_year  === forYear)
console.log('accounts: ', accounts.items)
console.log('remittances: ', this.remittances)
console.log('forMonth: ', forMonth+1)
console.log('forYear: ', forYear)
    return this.remittances
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

  newModel(flat_number) {
    const { forMonth, forYear } = this.state
    let newAccountModel = {
      id: 0,
      recorded_at: this.today.toISOString().substr(0,10),
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
    return newAccountModel
  }
*/


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
