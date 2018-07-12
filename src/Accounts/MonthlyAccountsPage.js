import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'
import Select from 'react-select';
import {
  MdNavigateBefore,
  MdNavigateNext
} from 'react-icons/lib/md' // material design icons
import {
  Button,
  Input,
  Label
} from 'reactstrap'

import {
  durationActions,
  flatActions,
  accountMonthlyActions as actions
} from '../_actions'
import { FlashMessage } from '../_components'
import { MONTHS, DEFAULTS } from '../_constants'
import { PaidDate } from './PaidDate'

import './MonthlyAccounts.css'

let url = '/accounts'
let module = 'accounts'
let defaultView = "box"

export class MonthlyAccounts extends React.Component {

  constructor(props) {
    super(props)
    this.today = new Date()
    this.state = {
      forMonth: this.today.getMonth(),
      forYear: this.today.getFullYear(),
      view: defaultView
    }
    this.handleMonthChange = this.handleMonthChange.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
    this.saveDateChange = this.saveDateChange.bind(this)
    this.handlePaidStatus = this.handlePaidStatus.bind(this)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.gotoNextMonth = this.gotoNextMonth.bind(this)
    this.gotoPreviousMonth = this.gotoPreviousMonth.bind(this)
  }
  componentDidMount() {
    const { forMonth, forYear } = this.state
    this.props.getAllFlats()
    this.props.getMonthlyListFor({month: forMonth, year: forYear})
  }
  render() {
    const { flats, alert, accounts } = this.props
    const { view } = this.state
    return <div>
              <h3>Monthly Accounts (Collections)</h3>
              { alert.message && <FlashMessage text={alert.message} color={alert.color} delay={2100}/> }
              { this.showListControl() }
              { flats.loading && <div>loading flats...</div>}
              { flats.error && <span className="text-danger">{flats.error}</span>}
              { accounts.loading && <div>loading accounts...</div>}
              { accounts.error && <span className="text-danger">{accounts.error}</span>}
              { accounts.items && flats.items && view === "list" && this.showListView() }
              { accounts.items && flats.items && view === "box" && this.showBoxes() }
           </div>
  }
  showListControl() {
    return <div className="list-control">
      { this.showPreviousMonth() }
      { this.showMonth() }
      { this.showYear() }
      { this.showNextMonth() }
      { this.showListSelect() }
      { this.showBoxSelect() }
    </div>
  }
  showPreviousMonth() {
    return <Button
      type="button"
      color="link"
      title="Goto Previous Month"
      onClick={this.gotoPreviousMonth}
      ><MdNavigateBefore/></Button>
  }
  gotoPreviousMonth() {
    const { forMonth, forYear } = this.state
    forMonth === 1 ?
      this.setState({forMonth: 12, forYear: forYear-1}, this.getMonthlyListFor) :
      this.setState({forMonth: forMonth-1}, this.getMonthlyListFor)
  }
  showMonth() {
    const { forMonth } = this.state
    return <div className="month"><Select
      id="forMonth"
      name="forMonth"
      value={forMonth}
      multi={false}
      joinValues={false}
      simpleValue={true}
      placeholder="Select a Month..."
      onChange={(selectedMonth) => this.handleMonthChange(selectedMonth)}
      valueKey="number"
      labelKey="name"
      options={MONTHS}
    /></div>
  }
  handleMonthChange(selectedMonth) {
    this.setState({forMonth: selectedMonth}, this.getMonthlyListFor)
  }
  showYear() {
    const { forYear } = this.state
    return <div className="year"><Input
      id="forYear"
      type="number"
      name="forYear"
      value={forYear}
      placeholder="Year here"
      min={DEFAULTS.AccountsMinYear}
      max={DEFAULTS.AccountsMaxYear}
      onChange={(event) => this.handleYearChange(event)}
    /></div>
  }
  handleYearChange(event) {
    const { name, value } = event.target
    this.setState( { forYear: parseInt(value) }, this.getMonthlyListFor )
  }
  showNextMonth() {
    return <Button
      type="button"
      color="link"
      title="Goto Next Month"
      onClick={this.gotoNextMonth}
      ><MdNavigateNext/></Button>
  }
  gotoNextMonth() {
    const { forMonth, forYear } = this.state
    forMonth === 12 ?
      this.setState({forMonth: 1, forYear: forYear+1}, this.getMonthlyListFor) :
      this.setState({forMonth: forMonth+1}, this.getMonthlyListFor)
  }

  getMonthlyListFor() {
    const { forMonth, forYear } = this.state
    this.props.getMonthlyListFor({month: forMonth, year: forYear})
  }

  showListSelect() {
    const { view } = this.state
    return <div className="list-view-select">
      <Input
        type="radio"
        name="view"
        value="list"
        checked={view === "list"}
        onChange={this.handleViewChange}
      /> List View
    </div>
  }
  showBoxSelect() {
    const { view } = this.state
    return <div className="box-view-select">
      <Input
        type="radio"
        name="view"
        value="box"
        checked={view === "box"}
        onChange={this.handleViewChange}
      /> Box View
    </div>
  }
  handleViewChange(event) {
    const {name, value} = event.target
    this.setState({[name]: value})
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

  showListView(){
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
      <th className="paid-status-header">Payment</th>
      <th>Date of Payment</th>
    </tr>
  }

  bodyRow(model,index) {
    const { authzn } = this.props
    let flatNum = model.flat_number
    let acct = this.getAccountOn(flatNum)
    return <tr key={model.id}>
      <td className="index-cell">{index+1}</td>
      <td className="flat-number-cell">{acct && this.showFlatNumber(acct)}</td>
      <td className="paid-status-cell">{acct && this.showPaidStatus(acct)}</td>
      <td className="paid-date-cell">{acct && <PaidDate account={acct} authzn={authzn} save={this.saveDateChange}/>}</td>
    </tr>
  }
  getAccountOn(flatNum) {
    const { accounts } = this.props
    let acct = accounts.items.find((each) => each.flat_number === flatNum)
    return acct ? acct : this.newAccount(flatNum)
  }
  showFlatNumber(account) {
    const { authzn } = this.props
    let title = authzn && authzn.allowsAdd && account.id === 0 ? 'Add' :
                authzn && authzn.allowsEdit ? 'Edit' : 'View'
    let link = <Link
      to={{ pathname: `${url}/${account.id}`, state:{model: account} }}
      title={title}
      style={this.getStyle()}
      className="flat-number"
      >{account.flat_number}</Link>

    return authzn && (authzn.allowsAdd || authzn.allowsEdit || authzn.allowsView) ?
      link : <span>{account.flat_number}</span>
  }
  getStyle() {
    const { authzn } = this.props
    return authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
      { cursor: "pointer" } :
      { cursor: "default" }
  }
  showPaidStatus(account) {
    const { authzn } = this.props
    let fn = authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
      (event) => this.handlePaidStatus(event, account) : null
    let id="paidStatus"+account.flat_number
    return <div className="paid-status">
        <Input
          id={id}
          className="paid-status-input"
          type="checkbox"
          name=""
          value={1}
          checked={account && account.id > 0}
          onChange={fn}
        /> <Label
            for={id}
            style={this.getStyle()}
            ></Label>
      </div>
  }
  handlePaidStatus(event, account) {
    if(account.id > 0 &&  window.confirm('Are you sure to remove this payment?') ) {
        this.props.delete(account)
    }
    if(account.id === 0 && window.confirm('Are you sure to add this payment?')) {
      this.props.saveChanges(account)
    }
  }

  saveDateChange(account, newDate) {
    if(account.id === 0) {
      account.recorded_at = newDate
      return ;  // do nothing for new account
    }
    let acct = account
    acct.recorded_at = newDate
    this.props.saveChanges(acct)
  }

  showBoxes() {
    const { flats } = this.props
    let models = flats
    return <ul className="monthly-account">
      { models.items.map((model, index) => this.showBox(model,index)) }
    </ul>
  }
  showBox(model, index) {
    const { authzn } = this.props
    let flatNum = model.flat_number
    let acct = this.getAccountOn(flatNum)
    //let today = new Date().toISOString().substr(0,10)

    return <li key={model.id} className="box">
      {acct && this.showFlatNumber(acct)}
      {acct && this.showPaidStatus(acct)}
      {acct && <PaidDate account={acct} authzn={authzn} save={this.saveDateChange}/>}
    </li>
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
