import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { accountMonthlyActions as actions } from '../_actions'
import {
  Button,
  Input
} from 'reactstrap'
import './MonthlyAccount.css'

let url = '/accounts'
let module = 'accounts'

export class MonthlyAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editDate: false,
      accountCopy: this.newAccount()
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleDateClick = this.handleDateClick.bind(this)
    this.togglePaidStatus = this.togglePaidStatus.bind(this)
  }
  componentDidMount() {
    const { flatNumber, forMonth, forYear } = this.props
    let data = { flatNumber, forMonth, forYear }
    this.props.getMonthlyAccountsFor(data)
  }
  newAccount() {
    const { flatNumber, forMonth, forYear } = this.props
    return {
      id: 0,
      flat_number: flatNumber,
      for_month: forMonth,
      for_year: forYear,
      recorded_at: this.today(),
      crdr: 'cr',
      item: 'Monthly Maintenance Fee',
      name: flatNumber+' Resident',
      amount: 600,
      balance: '',
      category: 'Monthly Maintenance',
      remarks: 'Paid monthly maintenance'
    }
  }
  render() {
    return <div
              className="monthly-account">
                { this.showFlatNumber() }
                { this.showPaidStatus() }
                { this.showPaidDate() }
            </div>
  }
  showFlatNumber() {
    const { authzn, flatNumber, account } = this.props
    const { accountCopy } = this.state
    let model = account && account.id > 0 ? account : accountCopy
    let title = authzn && authzn.allowsAdd && model.id === 0 ? 'Add' :
      authzn && authzn.allowsEdit ? 'Edit' : 'View'
    let link = <Link
      to={{ pathname: `${url}/${model.id}`, state:{model: model} }}
      title={title}
      className="flat-number"
      >{flatNumber}</Link>

    return authzn && (authzn.allowsAdd || authzn.allowsEdit || authzn.allowsView) ?
      link : <span>{flatNumber}</span>
  }
  showPaidStatus() {
    const { account, flatNumber } = this.props
    let id = account ? account.id : 0
    let recorded_at = account ? account.recorded_at : this.today()
    return <div
        role="button"
        className="paid-status"
        onClick={this.togglePaidStatus}
        style={this.getStyle()}
      >{id > 0?'PAID':'x'} Acct ID: {id}</div>
  }
  today(){
    return new Date().toISOString().substr(0,10)
  }
  togglePaidStatus() {
    const { account } = this.props
    let id = account?account.id:0
    if(id > 0) {
      console.log('Reverting payment for id: ', account.id)
      this.props.delete(account)
      let temp = account
      temp.id = 0
      temp.recorded_at = this.today()
      this.setState({ accountCopy: temp })
    } else {
      const { accountCopy } = this.state
      console.log('Adding payment for id: ', accountCopy.id)
      console.log('recorded_at: ', accountCopy.recorded_at)
      this.props.saveChanges(accountCopy)
    }
  }
  showPaidDate() {
    const { editDate } = this.state
    return editDate ?
      this.showDateInput() :
      this.showDate()
  }
  showDate() {
    const { account } = this.props
    const { accountCopy } = this.state
/*    let clickFunction = () =>
      authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
        this.setState({editDate: true}) : null; */
    let paidDate = account && account.id > 0 ?
                    account.recorded_at :
                    accountCopy.recorded_at
    return <div
        className="paid-date"
        role="button"
        onClick={this.handleDateClick}
        style={this.getStyle()}
      >{paidDate}</div>
  }
  handleDateClick() {
    const { authzn } = this.props
    if(!authzn) return;
    if(authzn.allowsAdd || authzn.allowsEdit) {
      this.setState({editDate: true})
    }
  }
  getStyle() {
    const { authzn } = this.props
    return authzn && (authzn.allowsAdd || authzn.allowsEdit) ?
      { cursor: "pointer" } :
      { cursor: "default" }
  }
  showDateInput() {
    const { account } = this.props
    const { accountCopy } = this.state
    let paidDate = account && account.id > 0 ?
                    account.recorded_at :
                    accountCopy.recorded_at
    return <div className="paid-date">
      <Input
        id="recordedAt"
        type="date"
        name="recorded_at"
        value={paidDate}
        onChange={this.handleDateChange}
      />
      <Button
        size="sm"
        color="danger"
        title="Cancel"
        onClick={() => this.setState({editDate: false})}
      >x</Button>
    </div>
  }
  handleDateChange(event) {
    const { name, value } = event.target
    const { account } = this.props
    const { accountCopy } = this.state
    let acct = account && account.id > 0 ? account : accountCopy
    this.setState({
      accountCopy: {
        ...acct,
        [name]: value },
      editDate: false
    },
    this.saveDateChange)
  }
  saveDateChange() {
    const { accountCopy } = this.state
    console.log('saving accountCopy: ', accountCopy)
    if(accountCopy.id > 0) {
      this.props.saveChanges(accountCopy)
    }
  }
} // end of MonthlyAccount class

function mapStateToProps(state) {
  const { accountsMonthly, authorizations } = state
  const authzn = authorizations[module]
  console.log('MonthlyAccount >> mapStateToProps: ', accountsMonthly)
  const account = accountsMonthly.model
  console.log('Monthly Account: ', account)
  return {
    account,
    authzn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMonthlyAccountsFor: (data) => {
      dispatch(actions.getMonthlyAccountsFor(data))
    },
    saveChanges: (model) => {
      dispatch(actions.saveChanges(model))
    },
    delete: (model) => {
      dispatch(actions.delete(model))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccount)
