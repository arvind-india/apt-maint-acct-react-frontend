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
import {
  accountActions as actions,
  userActions,
  durationActions,
  flatActions
} from '../_actions'
import { default as detailsPage } from './AccountDetailsPage'
import { DEFAULTS } from '../_constants'

let url = '/accounts'
let module = 'accounts'

export class MaintenanceFeeCollections extends React.Component {

  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      forMonth: today.getMonth() + 1,
      forYear: today.getFullYear()
    }
    this.handleChange = this.handleChange.bind(this)
//    this.handleDeleteModel = this.handleDeleteModel.bind(this)
  }
  fromDate() {
    const { forMonth, forYear } = this.state
    return new Date(1, forMonth, forYear)
  }

  toDate() {
    const { forMonth, forYear } = this.state
    let day = this.noOfDays()
    return new Date(day, forMonth, forYear)
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
        <div className="grid-form">{ this.showMonthAndYear() }</div>
        {flats.items && authzn && this.showFlatsGrid() }
      </div>
    )
  }

  showMonthAndYear() {
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
  showFlatsGrid(){
    const { accounts, flats } = this.props

    return <div>
      {flats.items.map( (flat, index) =>
        <p>{flat.flat_number}</p>
      )}
    </div>
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
