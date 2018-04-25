import React from 'react'
import { connect } from 'react-redux'

import { accountMonthlyActions as actions } from '../_actions'
import './MonthlyAccount.css'

export class MonthlyAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      accountCopy: this.newAccount()
    }
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
      recorded_at: this.recorded_at(),
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
    const { account, flatNumber } = this.props
    let id = account ? account.id : 0
    let recorded_at = account ? account.recorded_at : this.recorded_at()
    return <div
        role="button"
        className="monthly-account"
        onClick={() => this.togglePaidStatus() }
      >{flatNumber}: {id > 0?'PAID':'UNPAID'} on {recorded_at} : 'Account ID: ' {id}
    </div>
  }
  recorded_at(){
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
      temp.recorded_at = this.recorded_at()
      this.setState({ accountCopy: temp })
    } else {
      const { accountCopy } = this.state
      console.log('Adding payment for id: ', accountCopy.id)
      console.log('recorded_at: ', accountCopy.recorded_at)
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
