import React from 'react'
import { connect } from 'react-redux'

import { accountMonthlyActions as actions } from '../_actions'
import './MonthlyAccount.css'

export class MonthlyAccount extends React.Component {

  constructor(props) {
    const { flatNumber, forMonth, forYear, account } = props
    super(props)
    this.state = {
      accountCopy: account
    }
    let data = { flatNumber, forMonth, forYear }
    this.props.getMonthlyAccountsFor(data)
  }

  render() {
    const { account, flatNumber } = this.props
    const { accountCopy } = this.state
    let id = account ?
                account.id :
                accountCopy ?
                  accountCopy.id :
                  0
    let recorded_at = account ?
                        account.recorded_at :
                        accountCopy ?
                          accountCopy.recorded_at :
                          this.recorded_at()
    return <div
        role="button"
        className="monthly-account"
        onClick={() => this.togglePaidStatus() }
      >{flatNumber}: {id > 0?'PAID':'UNPAID'} on {recorded_at}
    </div>
  }
  recorded_at(){
    return new Date().toISOString().substr(0,10)
  }
  togglePaidStatus() {
    const { account } = this.props
    let id = account?account.id:0
    if(id > 0) {
      //alert('Reverting payment')
      let temp = account
      temp.id = 0
      temp.recorded_at = this.recorded_at()
      this.setState({ accountCopy: temp })
      this.props.delete(account.id)
    } else {
      //alert('Adding payment')
      const { accountCopy } = this.state
      this.props.saveChanges(accountCopy)
    }

  }

} // end of MonthlyAccount class

function mapStateToProps(state) {
  const { accountDetails, authorizations } = state
  const authzn = authorizations[module]
  const accounts = accountDetails.items
  const account = accounts && accounts.length > 0 ? accounts[0] : null
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
    delete: (id) => {
      dispatch(actions.delete(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyAccount)
