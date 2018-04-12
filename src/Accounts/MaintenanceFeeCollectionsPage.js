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
//    this.handleDeleteModel = this.handleDeleteModel.bind(this)
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
    console.log('Get Accounts from: ', this.fromDate());
    console.log('Get Accounts to: ', this.toDate())
    this.props.getAccountsFor(this.fromDate(), this.toDate())
    this.props.getFlats()
  }

  render() {
    const { accounts, flats, alert, authzn, trackHistory } = this.props
    //let models = accounts
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
    const paidFlats = this.accountsByFlat()
    return <ul className="grid">
      {flats.items.map( (flat, index) =>
        <li
          key={flat.id}
          className="box"
          role="button"
          onClick={event => this.doRemittance(event, flat)}>
            <div className="flat-number">{ flat.flat_number }</div>
            {paidFlats.length > 0 && <div className="payment">
              <span>&#10004; Paid2</span>
            </div>}
            <div className="recorded-at">{ flat.flat_number }</div>
        </li>
      )}
    </ul>
  }
  accountsByFlat() {
    const { accounts } = this.props
    const { forMonth, forYear } = this.state
    if(!accounts.items) return []
    let filteredAccounts = accounts.items.filter( (acct) =>
      acct.category === "Monthly Maintenance" &&
      acct.for_month === forMonth &&
      acct.for_year  === forYear)
    let results = filteredAccounts.map( (acct, index) => {
      results[acct.flat_number] = acct.recorded_at
    })
    console.log('accountsByFlat: ', results)
    return results
  }
  doRemittance(event, model) {
    //const { name, value } = event.target
    console.log('click event target: ', event.target)
    console.log('model ', model)
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


}

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
    getFlats: () => {
      dispatch(flatActions.getAll())
    },
    getAccountsFor: (fromDate, toDate) => {
      dispatch(actions.getListFor(fromDate, toDate))
    },
    delete: (id) => {
      dispatch(actions.delete(id))
    },
    getActive: (key, date) => {
      dispatch(durationActions.getActive(key, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceFeeCollections)
